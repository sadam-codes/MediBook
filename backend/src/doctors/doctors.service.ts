import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Doctor } from '../models/doctor.model';
import { User } from '../models/user.model';
import { ReviewsService } from '../reviews/reviews.service';

@Injectable()
export class DoctorsService {
    constructor(
        @InjectModel(Doctor)
        private doctorModel: typeof Doctor,
        private reviewsService: ReviewsService,
    ) { }

    private attachRatingToDoctor(
        doctor: Doctor,
        ratingMap: Map<number, { averageRating: number; reviewCount: number }>,
    ) {
        const stats = ratingMap.get(doctor.userId);
        const plain = doctor.get({ plain: true }) as any;
        plain.averageRating = stats?.averageRating ?? null;
        plain.reviewCount = stats?.reviewCount ?? 0;
        return plain;
    }

    async findAll(): Promise<any[]> {
        const doctors = await this.doctorModel.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'fullName', 'email', 'role', 'profileImage'],
                },
            ],
            where: {
                isAvailable: true,
            },
        });

        const ratingMap = await this.reviewsService.getRatingMapForDoctors(
            doctors.map((d) => d.userId),
        );

        return doctors.map((d) => this.attachRatingToDoctor(d, ratingMap));
    }

    async findOne(userId: number): Promise<any | null> {
        const doctor = await this.doctorModel.findOne({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'fullName', 'email', 'role', 'profileImage'],
                },
            ],
        });

        if (!doctor) {
            return null;
        }

        const ratingMap = await this.reviewsService.getRatingMapForDoctors([userId]);
        return this.attachRatingToDoctor(doctor, ratingMap);
    }
}
