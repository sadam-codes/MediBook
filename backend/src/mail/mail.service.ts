import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    private isEmailConfigured(): boolean {
        return Boolean(
            this.configService.get<string>('EMAIL_USER') &&
            this.configService.get<string>('EMAIL_PASS'),
        );
    }

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // Assuming Gmail, but can be generic SMTP
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS'),
            },
        });
    }

    async sendBookingNotificationToDoctor(doctorEmail: string, doctorName: string, patientName: string, patientPhone: string, date: string, time: string) {
        const mailOptions = {
            from: `"MediBook" <${this.configService.get<string>('EMAIL_USER')}>`,
            to: doctorEmail,
            subject: 'New Appointment Booked - MediBook',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #10b981;">New Appointment Notification</h2>
                    <p>R/s Dr. ${doctorName},</p>
                    <p>We are pleased to inform you that a new appointment has been scheduled through MediBook.</p>
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                        <p><strong>Patient Name:</strong> ${patientName}</p>
                        <p><strong>Contact Number:</strong> ${patientPhone}</p>
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Time:</strong> ${time}</p>
                    </div>
                    <p>MediBook is your premium healthcare companion, streamlining patient management and appointment scheduling.</p>
                    <p>Best Regards,<br/>Team MediBook</p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email to doctor:', error);
        }
    }

    async sendBookingConfirmationToPatient(patientEmail: string, patientName: string, doctorName: string, date: string, time: string) {
        const mailOptions = {
            from: `"MediBook" <${this.configService.get<string>('EMAIL_USER')}>`,
            to: patientEmail,
            subject: 'Appointment Confirmation - MediBook',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #10b981;">Appointment Confirmed!</h2>
                    <p>Hello ${patientName},</p>
                    <p>You have successfully booked an appointment with <strong>Dr. ${doctorName}</strong>.</p>
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                        <p><strong>Doctor:</strong> ${doctorName}</p>
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Time:</strong> ${time}</p>
                    </div>
                    <p>Please be on time for your consultation.</p>
                    <p>Thank you for choosing MediBook - your trusted partner in healthcare.</p>
                    <p>Best Regards,<br/>Team MediBook</p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email to patient:', error);
        }
    }

    async sendAppointmentReminderToPatient(
        patientEmail: string,
        patientName: string,
        doctorName: string,
        date: string,
        time: string,
    ) {
        const mailOptions = {
            from: `"MediBook" <${this.configService.get<string>('EMAIL_USER')}>`,
            to: patientEmail,
            subject: 'Appointment Reminder (24h) - MediBook',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #0284c7;">Reminder: Upcoming Appointment</h2>
                    <p>Hello ${patientName},</p>
                    <p>This is a friendly reminder that your consultation with <strong>Dr. ${doctorName}</strong> is within the next 24 hours.</p>
                    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd; margin: 20px 0;">
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Time:</strong> ${time}</p>
                    </div>
                    <p>Please arrive on time. Contact the clinic if you need to reschedule (at least 24 hours before).</p>
                    <p>Best Regards,<br/>Team MediBook</p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending reminder to patient:', error);
        }
    }

    async sendAppointmentReminderToDoctor(
        doctorEmail: string,
        doctorName: string,
        patientName: string,
        date: string,
        time: string,
    ) {
        const mailOptions = {
            from: `"MediBook" <${this.configService.get<string>('EMAIL_USER')}>`,
            to: doctorEmail,
            subject: 'Appointment Reminder (24h) - MediBook',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #0284c7;">Upcoming Patient Appointment</h2>
                    <p>Dr. ${doctorName},</p>
                    <p>Reminder: <strong>${patientName}</strong> has a consultation within the next 24 hours.</p>
                    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd; margin: 20px 0;">
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Time:</strong> ${time}</p>
                    </div>
                    <p>Best Regards,<br/>Team MediBook</p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending reminder to doctor:', error);
        }
    }

    async sendCancellationEmails(
        patientEmail: string,
        doctorEmail: string,
        patientName: string,
        doctorName: string,
        date: string,
        time: string,
        reason: string,
        cancelledBy: string,
    ) {
        const patientMail = {
            from: `"MediBook" <${this.configService.get<string>('EMAIL_USER')}>`,
            to: patientEmail,
            subject: 'Appointment Cancelled - MediBook',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #dc2626;">Appointment Cancelled</h2>
                    <p>Hello ${patientName},</p>
                    <p>Your appointment with <strong>Dr. ${doctorName}</strong> on ${date} at ${time} has been cancelled.</p>
                    <p><strong>Reason:</strong> ${reason}</p>
                    <p>You may book a new slot anytime from your MediBook dashboard.</p>
                </div>
            `,
        };

        const doctorMail = {
            from: `"MediBook" <${this.configService.get<string>('EMAIL_USER')}>`,
            to: doctorEmail,
            subject: 'Appointment Cancelled - MediBook',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #dc2626;">Appointment Cancelled</h2>
                    <p>Dr. ${doctorName},</p>
                    <p>The appointment with <strong>${patientName}</strong> on ${date} at ${time} was cancelled by ${cancelledBy}.</p>
                    <p><strong>Reason:</strong> ${reason}</p>
                </div>
            `,
        };

        try {
            await Promise.all([
                this.transporter.sendMail(patientMail),
                this.transporter.sendMail(doctorMail),
            ]);
        } catch (error) {
            console.error('Error sending cancellation emails:', error);
        }
    }

    async sendRescheduleEmails(
        patientEmail: string,
        doctorEmail: string,
        patientName: string,
        doctorName: string,
        oldDate: string,
        oldTime: string,
        newDate: string,
        newTime: string,
    ) {
        if (!this.isEmailConfigured()) {
            return;
        }

        const patientMail = {
            from: `"MediBook" <${this.configService.get<string>('EMAIL_USER')}>`,
            to: patientEmail,
            subject: 'Appointment Rescheduled - MediBook',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #0284c7;">Appointment Rescheduled</h2>
                    <p>Hello ${patientName},</p>
                    <p>Your appointment with <strong>Dr. ${doctorName}</strong> has been rescheduled.</p>
                    <p><strong>Previous:</strong> ${oldDate} at ${oldTime}</p>
                    <p><strong>New:</strong> ${newDate} at ${newTime}</p>
                </div>
            `,
        };

        const doctorMail = {
            from: `"MediBook" <${this.configService.get<string>('EMAIL_USER')}>`,
            to: doctorEmail,
            subject: 'Appointment Rescheduled - MediBook',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #0284c7;">Appointment Rescheduled</h2>
                    <p>Dr. ${doctorName},</p>
                    <p><strong>${patientName}</strong> rescheduled their appointment.</p>
                    <p><strong>Previous:</strong> ${oldDate} at ${oldTime}</p>
                    <p><strong>New:</strong> ${newDate} at ${newTime}</p>
                </div>
            `,
        };

        try {
            await Promise.all([
                this.transporter.sendMail(patientMail),
                this.transporter.sendMail(doctorMail),
            ]);
        } catch (error) {
            console.error('Error sending reschedule emails:', error);
        }
    }
}
