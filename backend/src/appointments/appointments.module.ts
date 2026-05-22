import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from '../models/appointment.model';
import { User } from '../models/user.model';
import { Doctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Appointment, User, Doctor, Patient]),
        MailModule
    ],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
    exports: [AppointmentsService]
})
export class AppointmentsModule { }
