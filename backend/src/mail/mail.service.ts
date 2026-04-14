import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

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
}
