import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Op } from 'sequelize';
import { Appointment, AppointmentStatus, PaymentStatus } from '../models/appointment.model';
import { User } from '../models/user.model';
import { Doctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';
import { Review } from '../models/review.model';
import { Payment } from '../models/payment.model';
import { MailService } from '../mail/mail.service';
import { SmsService } from '../sms/sms.service';
import {
    getAppointmentDateTime,
    getHoursUntilAppointment,
    isAppointmentInPast,
    isWithinReminderWindow,
} from './appointment-date.util';

const PENDING_SLOT_HOLD_MINUTES = 30;
const AUTO_COMPLETE_HOURS_AFTER = 2;

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectModel(Appointment)
        private appointmentModel: typeof Appointment,
        @InjectModel(User)
        private userModel: typeof User,
        @InjectModel(Doctor)
        private doctorModel: typeof Doctor,
        @InjectModel(Payment)
        private paymentModel: typeof Payment,
        private mailService: MailService,
        private smsService: SmsService,
        private configService: ConfigService,
    ) { }

    private getPendingHoldCutoff() {
        return new Date(Date.now() - PENDING_SLOT_HOLD_MINUTES * 60 * 1000);
    }

    private getChangeMinHours() {
        return Number(this.configService.get<string>('APPOINTMENT_CHANGE_MIN_HOURS') ?? 24);
    }

    private getSlotBlockingWhere(doctorUserId: number, date: string, time: string) {
        return {
            doctorUserId,
            date,
            time,
            [Op.or]: [
                { status: AppointmentStatus.CONFIRMED },
                {
                    status: AppointmentStatus.PENDING,
                    paymentStatus: PaymentStatus.PENDING,
                    createdAt: { [Op.gte]: this.getPendingHoldCutoff() },
                },
            ],
        };
    }

    private async getAppointmentForPatient(appointmentId: number, patientId: number) {
        const appointment = await this.appointmentModel.findByPk(appointmentId);
        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }
        if (appointment.patientId !== patientId) {
            throw new ForbiddenException('Not authorized to manage this appointment');
        }
        return appointment;
    }

    private async getAppointmentForDoctor(appointmentId: number, doctorUserId: number) {
        const appointment = await this.appointmentModel.findByPk(appointmentId);
        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }
        if (appointment.doctorUserId !== doctorUserId) {
            throw new ForbiddenException('Not authorized to manage this appointment');
        }
        return appointment;
    }

    private assertPatientCanChangeSchedule(appointment: Appointment) {
        if (appointment.status !== AppointmentStatus.CONFIRMED) {
            throw new BadRequestException('Only confirmed appointments can be changed');
        }
        if (appointment.paymentStatus !== PaymentStatus.PAID) {
            throw new BadRequestException('Payment must be completed before changing appointment');
        }

        const minHours = this.getChangeMinHours();
        const hoursUntil = getHoursUntilAppointment(appointment.date, appointment.time);
        if (hoursUntil < minHours) {
            throw new BadRequestException(
                `Cancel/reschedule is allowed at least ${minHours} hours before the appointment`,
            );
        }
    }

    async assertSlotAvailable(
        data: {
            doctorId: number;
            patientId: number;
            date: string;
            time: string;
        },
        excludeAppointmentId?: number,
    ) {
        const existing = await this.appointmentModel.findOne({
            where: this.getSlotBlockingWhere(data.doctorId, data.date, data.time),
        });

        if (existing && existing.id !== excludeAppointmentId) {
            if (existing.patientId === data.patientId) {
                throw new BadRequestException('You have already booked this appointment');
            }
            throw new BadRequestException('This slot is already booked by another patient');
        }
    }

    async createPending(data: any) {
        if (!data.doctorId || !data.patientId || !data.date || !data.time) {
            throw new BadRequestException('Missing booking details');
        }

        await this.assertSlotAvailable(data);

        return this.appointmentModel.create({
            doctorUserId: data.doctorId,
            patientId: data.patientId,
            date: data.date,
            time: data.time,
            fee: data.fee,
            status: AppointmentStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            notes: data.notes,
        });
    }

    async confirmAfterPayment(appointmentId: number, stripeSessionId: string) {
        const appointment = await this.appointmentModel.findByPk(appointmentId);

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        if (appointment.status === AppointmentStatus.CONFIRMED) {
            return appointment;
        }

        await appointment.update({
            status: AppointmentStatus.CONFIRMED,
            paymentStatus: PaymentStatus.PAID,
            stripeSessionId,
        });

        this.sendBookingEmails(appointment);

        return appointment;
    }

    async cancelPending(appointmentId: number) {
        const appointment = await this.appointmentModel.findByPk(appointmentId);

        if (!appointment || appointment.status !== AppointmentStatus.PENDING) {
            return;
        }

        await appointment.update({
            status: AppointmentStatus.CANCELLED,
            paymentStatus: PaymentStatus.FAILED,
        });
    }

    async cancelByPatient(appointmentId: number, patientId: number, reason?: string) {
        const appointment = await this.getAppointmentForPatient(appointmentId, patientId);
        this.assertPatientCanChangeSchedule(appointment);

        await appointment.update({
            status: AppointmentStatus.CANCELLED,
            cancellationReason: reason ?? 'Cancelled by patient',
            reminderSentAt: null,
        });

        await this.sendCancellationNotifications(appointment, 'patient');
        return appointment;
    }

    async rescheduleByPatient(
        appointmentId: number,
        patientId: number,
        data: { date: string; time: string },
    ) {
        const appointment = await this.getAppointmentForPatient(appointmentId, patientId);
        this.assertPatientCanChangeSchedule(appointment);

        await this.assertSlotAvailable(
            {
                doctorId: appointment.doctorUserId,
                patientId,
                date: data.date,
                time: data.time,
            },
            appointmentId,
        );

        const previousDate = appointment.date;
        const previousTime = appointment.time;

        await appointment.update({
            date: data.date,
            time: data.time,
            reminderSentAt: null,
        });

        await this.paymentModel.update(
            { appointmentDate: data.date, appointmentTime: data.time },
            { where: { appointmentId: appointment.id } },
        );

        await this.sendRescheduleNotifications(appointment, previousDate, previousTime);
        return appointment;
    }

    async markComplete(appointmentId: number, doctorUserId: number) {
        const appointment = await this.getAppointmentForDoctor(appointmentId, doctorUserId);

        if (appointment.status !== AppointmentStatus.CONFIRMED) {
            throw new BadRequestException('Only confirmed appointments can be marked complete');
        }

        await appointment.update({
            status: AppointmentStatus.COMPLETED,
            completedAt: new Date(),
        });

        return appointment;
    }

    async markNoShow(appointmentId: number, doctorUserId: number) {
        const appointment = await this.getAppointmentForDoctor(appointmentId, doctorUserId);

        if (appointment.status !== AppointmentStatus.CONFIRMED) {
            throw new BadRequestException('Only confirmed appointments can be marked as no-show');
        }

        if (!isAppointmentInPast(appointment.date, appointment.time)) {
            throw new BadRequestException('No-show can only be marked after the appointment time');
        }

        await appointment.update({
            status: AppointmentStatus.NO_SHOW,
            completedAt: new Date(),
        });

        return appointment;
    }

    async autoCompletePastAppointments(): Promise<number> {
        const confirmed = await this.appointmentModel.findAll({
            where: { status: AppointmentStatus.CONFIRMED },
        });

        let count = 0;
        const cutoffMs = AUTO_COMPLETE_HOURS_AFTER * 60 * 60 * 1000;

        for (const appt of confirmed) {
            const endTime = getAppointmentDateTime(appt.date, appt.time).getTime() + cutoffMs;
            if (Date.now() >= endTime) {
                await appt.update({
                    status: AppointmentStatus.COMPLETED,
                    completedAt: new Date(),
                });
                count++;
            }
        }

        return count;
    }

    async sendUpcomingReminders(): Promise<number> {
        const appointments = await this.appointmentModel.findAll({
            where: {
                status: AppointmentStatus.CONFIRMED,
                reminderSentAt: null,
            },
        });

        let count = 0;

        for (const appt of appointments) {
            if (!isWithinReminderWindow(appt.date, appt.time)) {
                continue;
            }

            const doctor = await this.userModel.findByPk(appt.doctorUserId);
            const patientUser = await this.userModel.findByPk(appt.patientId, {
                include: [{ model: Patient }],
            });

            if (!doctor || !patientUser) {
                continue;
            }

            const patientPhone = patientUser.patient?.phoneNumber;

            await this.mailService.sendAppointmentReminderToPatient(
                patientUser.email,
                patientUser.fullName,
                doctor.fullName,
                appt.date,
                appt.time,
            );

            await this.mailService.sendAppointmentReminderToDoctor(
                doctor.email,
                doctor.fullName,
                patientUser.fullName,
                appt.date,
                appt.time,
            );

            if (patientPhone) {
                await this.smsService.sendReminder(
                    patientPhone,
                    `MediBook reminder: Appointment with Dr. ${doctor.fullName} on ${appt.date} at ${appt.time}.`,
                );
            }

            await appt.update({ reminderSentAt: new Date() });
            count++;
        }

        return count;
    }

    async findById(id: number) {
        return this.appointmentModel.findByPk(id);
    }

    async getDoctorForAppointment(doctorUserId: number) {
        return this.userModel.findByPk(doctorUserId, {
            attributes: ['fullName'],
        });
    }

    private async sendBookingEmails(appt: Appointment) {
        try {
            const doctor = await this.userModel.findByPk(appt.doctorUserId);
            const patientUser = await this.userModel.findByPk(appt.patientId, {
                include: [{ model: Patient }],
            });

            if (doctor && patientUser) {
                const patientPhone = patientUser.patient?.phoneNumber || 'Not Provided';

                await this.mailService.sendBookingNotificationToDoctor(
                    doctor.email,
                    doctor.fullName,
                    patientUser.fullName,
                    patientPhone,
                    appt.date,
                    appt.time,
                );

                await this.mailService.sendBookingConfirmationToPatient(
                    patientUser.email,
                    patientUser.fullName,
                    doctor.fullName,
                    appt.date,
                    appt.time,
                );
            }
        } catch (error) {
            console.error('Failed to process booking emails:', error);
        }
    }

    private async sendCancellationNotifications(appt: Appointment, cancelledBy: string) {
        try {
            const doctor = await this.userModel.findByPk(appt.doctorUserId);
            const patientUser = await this.userModel.findByPk(appt.patientId);

            if (doctor && patientUser) {
                await this.mailService.sendCancellationEmails(
                    patientUser.email,
                    doctor.email,
                    patientUser.fullName,
                    doctor.fullName,
                    appt.date,
                    appt.time,
                    appt.cancellationReason ?? 'No reason provided',
                    cancelledBy,
                );
            }
        } catch (error) {
            console.error('Failed to send cancellation emails:', error);
        }
    }

    private async sendRescheduleNotifications(
        appt: Appointment,
        previousDate: string,
        previousTime: string,
    ) {
        try {
            const doctor = await this.userModel.findByPk(appt.doctorUserId);
            const patientUser = await this.userModel.findByPk(appt.patientId);

            if (doctor && patientUser) {
                await this.mailService.sendRescheduleEmails(
                    patientUser.email,
                    doctor.email,
                    patientUser.fullName,
                    doctor.fullName,
                    previousDate,
                    previousTime,
                    appt.date,
                    appt.time,
                );
            }
        } catch (error) {
            console.error('Failed to send reschedule emails:', error);
        }
    }

    async findByDoctor(doctorUserId: number, date?: string) {
        const where: any = {
            doctorUserId,
            [Op.or]: [
                { status: AppointmentStatus.CONFIRMED },
                {
                    status: AppointmentStatus.PENDING,
                    paymentStatus: PaymentStatus.PENDING,
                    createdAt: { [Op.gte]: this.getPendingHoldCutoff() },
                },
            ],
        };

        if (date) where.date = date;

        return this.appointmentModel.findAll({
            where,
            include: [{ model: User, as: 'patient', attributes: ['fullName', 'email', 'profileImage'] }],
        });
    }

    async findManagedByDoctor(doctorUserId: number) {
        return this.appointmentModel.findAll({
            where: {
                doctorUserId,
                status: {
                    [Op.in]: [
                        AppointmentStatus.CONFIRMED,
                        AppointmentStatus.COMPLETED,
                        AppointmentStatus.NO_SHOW,
                    ],
                },
            },
            order: [['date', 'DESC'], ['time', 'DESC']],
            include: [{
                model: User,
                as: 'patient',
                attributes: ['fullName', 'email', 'profileImage'],
            }],
        });
    }

    async findByPatient(patientId: number) {
        return this.appointmentModel.findAll({
            where: {
                patientId,
                status: { [Op.ne]: AppointmentStatus.CANCELLED },
            },
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'doctorUser',
                attributes: ['fullName', 'profileImage'],
                include: [{
                    model: Doctor,
                    attributes: ['phoneNumber', 'specialization', 'clinicName', 'startTime', 'endTime', 'breakTime', 'appointmentDuration'],
                }],
            }, {
                model: Review,
                attributes: ['id', 'rating', 'comment', 'createdAt'],
            }],
        });
    }

    async findAllForAdmin() {
        return this.appointmentModel.findAll({
            order: [['createdAt', 'DESC']],
            include: [
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
            ],
        });
    }
}
