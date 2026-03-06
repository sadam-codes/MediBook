import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor } from '../models/doctor.model';
import { User } from '../models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Doctor, User])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService]
})
export class DoctorsModule { }
