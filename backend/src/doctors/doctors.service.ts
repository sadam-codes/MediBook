import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Doctor } from '../models/doctor.model';
import { User } from '../models/user.model';

@Injectable()
export class DoctorsService {
    constructor(
        @InjectModel(Doctor)
        private doctorModel: typeof Doctor,
    ) { }

    async findAll(): Promise<Doctor[]> {
        return this.doctorModel.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'fullName', 'email', 'role', 'profileImage'], // Exclude password
                },
            ],
            where: {
                isAvailable: true, // Only fetch available doctors
            }
        });
    }

    async findOne(userId: number): Promise<Doctor | null> {
        return this.doctorModel.findOne({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'fullName', 'email', 'role', 'profileImage'],
                },
            ],
        });
    }
}
