import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Appointment } from '../models/appointment.model';
import { User } from '../models/user.model';
import { Doctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectModel(Appointment)
        private appointmentModel: typeof Appointment,
        @InjectModel(User)
        private userModel: typeof User,
        @InjectModel(Doctor)
        private doctorModel: typeof Doctor,
        private mailService: MailService,
    ) { }

    async create(data: any) {
        // Enforce basic validation
        if (!data.doctorId || !data.patientId || !data.date || !data.time) {
            throw new BadRequestException('Missing booking details');
        }

        // Check if slot already booked
        const existing = await this.appointmentModel.findOne({
            where: {
                doctorUserId: data.doctorId,
                date: data.date,
                time: data.time,
                status: 'confirmed'
            }
        });

        if (existing) {
            if (existing.patientId === data.patientId) {
                throw new BadRequestException('You have already booked this appointment');
            }
            throw new BadRequestException('This slot is already booked by another patient');
        }

        const appointment = await this.appointmentModel.create({
            doctorUserId: data.doctorId,
            patientId: data.patientId,
            date: data.date,
            time: data.time,
            fee: data.fee,
            status: 'confirmed', // Auto-confirming for now
            notes: data.notes
        });

        // Async email sending (don't await to avoid blocking response)
        this.sendBookingEmails(appointment);

        return appointment;
    }

    private async sendBookingEmails(appt: Appointment) {
        try {
            // Fetch Doctor details
            const doctor = await this.userModel.findByPk(appt.doctorUserId);
            // Fetch Patient details (User + Patient for phone)
            const patientUser = await this.userModel.findByPk(appt.patientId, {
                include: [{ model: Patient }]
            });

            if (doctor && patientUser) {
                const patientPhone = patientUser.patient?.phoneNumber || 'Not Provided';

                // Email to Doctor
                await this.mailService.sendBookingNotificationToDoctor(
                    doctor.email,
                    doctor.fullName,
                    patientUser.fullName,
                    patientPhone,
                    appt.date,
                    appt.time
                );

                // Email to Patient
                await this.mailService.sendBookingConfirmationToPatient(
                    patientUser.email,
                    patientUser.fullName,
                    doctor.fullName,
                    appt.date,
                    appt.time
                );
            }
        } catch (error) {
            console.error('Failed to process booking emails:', error);
        }
    }

    async findByDoctor(doctorUserId: number, date?: string) {
        const where: any = { doctorUserId };
        if (date) where.date = date;

        return this.appointmentModel.findAll({
            where,
            include: [{ model: User, as: 'patient', attributes: ['fullName', 'email', 'profileImage'] }]
        });
    }

    async findByPatient(patientId: number) {
        return this.appointmentModel.findAll({
            where: { patientId },
            include: [{
                model: User,
                as: 'doctorUser',
                attributes: ['fullName', 'profileImage'],
                include: [{
                    model: Doctor,
                    attributes: ['phoneNumber', 'specialization', 'clinicName']
                }]
            }]
        });
    }
}
