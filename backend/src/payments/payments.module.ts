import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { AppointmentsModule } from '../appointments/appointments.module';
import { Payment } from '../models/payment.model';
import { User } from '../models/user.model';
import { Doctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';
import { Appointment } from '../models/appointment.model';

@Module({
    imports: [
        ConfigModule,
        AppointmentsModule,
        SequelizeModule.forFeature([Payment, User, Doctor, Patient, Appointment]),
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService],
})
export class PaymentsModule {}
