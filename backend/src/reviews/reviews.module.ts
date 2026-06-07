import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review } from '../models/review.model';
import { Appointment } from '../models/appointment.model';
import { User } from '../models/user.model';

@Module({
    imports: [SequelizeModule.forFeature([Review, Appointment, User])],
    controllers: [ReviewsController],
    providers: [ReviewsService],
    exports: [ReviewsService],
})
export class ReviewsModule {}
