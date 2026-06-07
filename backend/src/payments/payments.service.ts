import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { AppointmentsService } from '../appointments/appointments.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { PaymentStatus } from '../models/appointment.model';
import { Payment, PaymentRecordStatus } from '../models/payment.model';
import { User } from '../models/user.model';
import { Doctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';
import { Appointment } from '../models/appointment.model';

type StripeClient = InstanceType<typeof Stripe>;

@Injectable()
export class PaymentsService {
    private stripe: StripeClient | null = null;

    constructor(
        private configService: ConfigService,
        private appointmentsService: AppointmentsService,
        @InjectModel(Payment)
        private paymentModel: typeof Payment,
    ) {}

    private getStripe(): StripeClient {
        if (!this.stripe) {
            const secretKey =
                this.configService.get<string>('STRIPE_SECRET_KEY') ??
                this.configService.get<string>('STRIPE_API_KEY');

            if (!secretKey) {
                throw new BadRequestException('Stripe is not configured');
            }

            this.stripe = new Stripe(secretKey);
        }

        return this.stripe;
    }

    private paymentIncludes = [
        {
            model: User,
            as: 'patient',
            attributes: ['id', 'fullName', 'email', 'profileImage'],
            include: [{ model: Patient, attributes: ['phoneNumber'] }],
        },
        {
            model: User,
            as: 'doctorUser',
            attributes: ['id', 'fullName', 'email', 'profileImage'],
            include: [{
                model: Doctor,
                attributes: ['specialization', 'clinicName', 'clinicAddress', 'phoneNumber', 'city'],
            }],
        },
        {
            model: Appointment,
            attributes: ['id', 'date', 'time', 'fee', 'status', 'paymentStatus', 'notes'],
        },
    ];

    async createCheckoutSession(dto: CreateCheckoutDto, patientId: number) {
        const appointment = await this.appointmentsService.createPending({
            ...dto,
            patientId,
        });

        const doctor = await this.appointmentsService.getDoctorForAppointment(
            appointment.doctorUserId,
        );
        const doctorName = doctor?.fullName ?? 'Doctor';
        const currency = (this.configService.get<string>('STRIPE_CURRENCY') ?? 'pkr').toLowerCase();
        const frontendUrl =
            this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:5173';
        const amount = Math.round(Number(dto.fee) * 100);

        if (amount <= 0) {
            throw new BadRequestException('Invalid consultation fee');
        }

        const session = await this.getStripe().checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: `Consultation with Dr. ${doctorName}`,
                            description: `${dto.date} at ${dto.time}`,
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                appointmentId: String(appointment.id),
                patientId: String(patientId),
            },
            success_url: `${frontendUrl}/bookings/${dto.doctorId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/bookings/${dto.doctorId}?payment=cancelled&appointment_id=${appointment.id}`,
        });

        await appointment.update({ stripeSessionId: session.id });

        await this.paymentModel.create({
            appointmentId: appointment.id,
            patientId,
            doctorUserId: appointment.doctorUserId,
            amount: dto.fee,
            currency,
            status: PaymentRecordStatus.PENDING,
            stripeSessionId: session.id,
            appointmentDate: dto.date,
            appointmentTime: dto.time,
        });

        return {
            url: session.url,
            appointmentId: appointment.id,
            sessionId: session.id,
        };
    }

    private async syncPaymentFromStripeSession(sessionId: string) {
        const session = await this.getStripe().checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent', 'payment_intent.payment_method'],
        });

        const appointmentId = Number(session.metadata?.appointmentId);
        if (!appointmentId) {
            throw new BadRequestException('Invalid payment session');
        }

        const payment = await this.paymentModel.findOne({ where: { appointmentId } });
        if (!payment) {
            throw new NotFoundException('Payment record not found');
        }

        const paymentIntent = session.payment_intent as any;
        const intent = paymentIntent && typeof paymentIntent !== 'string' ? paymentIntent : null;
        const paymentMethod =
            intent?.payment_method && typeof intent.payment_method !== 'string'
                ? intent.payment_method
                : null;
        const card = paymentMethod?.card ?? null;

        if (session.payment_status === 'paid') {
            await payment.update({
                status: PaymentRecordStatus.PAID,
                stripePaymentIntentId: intent?.id ?? payment.stripePaymentIntentId,
                stripeCustomerEmail: session.customer_details?.email ?? payment.stripeCustomerEmail,
                paymentMethod: paymentMethod?.type ?? 'card',
                cardBrand: card?.brand ?? null,
                cardLast4: card?.last4 ?? null,
                receiptUrl: session.url ?? payment.receiptUrl,
                paidAt: new Date(),
                failureReason: null,
            });

            await this.appointmentsService.confirmAfterPayment(appointmentId, sessionId);
        }

        return { session, payment, appointmentId };
    }

    async verifySession(sessionId: string, patientId: number) {
        const session = await this.getStripe().checkout.sessions.retrieve(sessionId);

        if (!session.metadata?.appointmentId) {
            throw new BadRequestException('Invalid payment session');
        }

        if (Number(session.metadata.patientId) !== patientId) {
            throw new ForbiddenException('Not authorized to view this payment');
        }

        const appointmentId = Number(session.metadata.appointmentId);
        const appointment = await this.appointmentsService.findById(appointmentId);

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        if (
            session.payment_status === 'paid' &&
            appointment.paymentStatus !== PaymentStatus.PAID
        ) {
            await this.syncPaymentFromStripeSession(sessionId);
        }

        const payment = await this.paymentModel.findOne({
            where: { appointmentId },
            include: this.paymentIncludes,
        });

        return {
            paid: session.payment_status === 'paid',
            appointment: await this.appointmentsService.findById(appointmentId),
            payment,
        };
    }

    async handleWebhook(rawBody: Buffer, signature: string) {
        const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

        if (!webhookSecret) {
            throw new BadRequestException('Stripe webhook secret is not configured');
        }

        let eventPayload: any;

        try {
            eventPayload = this.getStripe().webhooks.constructEvent(
                rawBody,
                signature,
                webhookSecret,
            );
        } catch {
            throw new BadRequestException('Invalid Stripe webhook signature');
        }

        if (eventPayload.type === 'checkout.session.completed') {
            const session = eventPayload.data.object as {
                id: string;
                payment_status: string;
            };

            if (session.payment_status === 'paid') {
                await this.syncPaymentFromStripeSession(session.id);
            }
        }

        if (eventPayload.type === 'checkout.session.expired') {
            const session = eventPayload.data.object as {
                metadata?: { appointmentId?: string };
            };
            const appointmentId = Number(session.metadata?.appointmentId);

            if (appointmentId) {
                await this.markPaymentCancelled(appointmentId, 'Checkout session expired');
                await this.appointmentsService.cancelPending(appointmentId);
            }
        }

        return { received: true };
    }

    private async markPaymentCancelled(appointmentId: number, reason: string) {
        const payment = await this.paymentModel.findOne({ where: { appointmentId } });
        if (!payment || payment.status === PaymentRecordStatus.PAID) {
            return;
        }

        await payment.update({
            status: PaymentRecordStatus.CANCELLED,
            failureReason: reason,
        });
    }

    async cancelPendingAppointment(appointmentId: number, patientId: number) {
        const appointment = await this.appointmentsService.findById(appointmentId);

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        if (appointment.patientId !== patientId) {
            throw new ForbiddenException('Not authorized to cancel this appointment');
        }

        await this.markPaymentCancelled(appointmentId, 'Payment cancelled by patient');
        await this.appointmentsService.cancelPending(appointmentId);

        return { message: 'Pending appointment cancelled' };
    }

    async findAllForAdmin() {
        return this.paymentModel.findAll({
            order: [['createdAt', 'DESC']],
            include: this.paymentIncludes,
        });
    }

    async findByPatient(patientId: number) {
        return this.paymentModel.findAll({
            where: { patientId },
            order: [['createdAt', 'DESC']],
            include: this.paymentIncludes,
        });
    }

    async findByDoctor(doctorUserId: number) {
        return this.paymentModel.findAll({
            where: { doctorUserId },
            order: [['createdAt', 'DESC']],
            include: this.paymentIncludes,
        });
    }
}
