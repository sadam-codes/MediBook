import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentsScheduler } from './appointments.scheduler';
import { Appointment } from '../models/appointment.model';
import { Payment } from '../models/payment.model';
import { User } from '../models/user.model';
import { Doctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';
import { Review } from '../models/review.model';
import { MailModule } from '../mail/mail.module';
import { SmsModule } from '../sms/sms.module';

@Module({
    imports: [
        ConfigModule,
        SequelizeModule.forFeature([Appointment, User, Doctor, Patient, Review, Payment]),
        MailModule,
        SmsModule,
    ],
    controllers: [AppointmentsController],
    providers: [AppointmentsService, AppointmentsScheduler],
    exports: [AppointmentsService],
})
export class AppointmentsModule { }
