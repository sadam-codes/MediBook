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
                    attributes: ['id', 'firstName', 'lastName', 'email', 'role'], // Exclude password
                },
            ],
            where: {
                isAvailable: true, // Only fetch available doctors
            }
        });
    }
}
