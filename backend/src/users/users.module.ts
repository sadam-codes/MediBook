import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../models/user.model';

import { Doctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';
import { Admin } from '../models/admin.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Doctor, Patient, Admin])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
