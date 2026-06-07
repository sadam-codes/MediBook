import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor } from '../models/doctor.model';
import { User } from '../models/user.model';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [SequelizeModule.forFeature([Doctor, User]), ReviewsModule],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService]
})
export class DoctorsModule { }
