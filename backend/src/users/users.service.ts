import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Doctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';
import { Admin } from '../models/admin.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userModel: typeof User,
        @InjectModel(Doctor) private doctorModel: typeof Doctor,
        @InjectModel(Patient) private patientModel: typeof Patient,
        @InjectModel(Admin) private adminModel: typeof Admin,
    ) { }

    async findAll() {
        return this.userModel.findAll({
            attributes: { exclude: ['password'] }
        });
    }

    async joinDoctor(userId: number, dto: any) {
        // Upgrade role to doctor
        await this.userModel.update({ role: 'doctor' }, { where: { id: userId } });

        // Create or update doctor record
        const [doctor, created] = await this.doctorModel.findOrCreate({
            where: { userId },
            defaults: { ...dto, userId }
        });

        if (!created) {
            await doctor.update(dto);
        }

        return { message: 'Successfully joined as a doctor', doctor };
    }

    async completePatientProfile(userId: number, dto: any) {
        // Create or update patient profile
        const [patient, created] = await this.patientModel.findOrCreate({
            where: { userId },
            defaults: { ...dto, userId }
        });

        if (!created) {
            await patient.update(dto);
        }

        return { message: 'Patient profile completed', patient };
    }

    async updateRole(userId: number, role: string) {
        await this.userModel.update({ role }, { where: { id: userId } });
        return { message: `User role updated to ${role}` };
    }

    async delete(userId: number) {
        // Explicitly delete associations if CASCADE at DB level is not fully configured or supported
        await this.doctorModel.destroy({ where: { userId } });
        await this.patientModel.destroy({ where: { userId } });
        await this.adminModel.destroy({ where: { userId } });

        // Also delete appointments where this user is either patient or doctor
        await this.userModel.sequelize?.query(
            `DELETE FROM appointments WHERE "patientId" = ${userId} OR "doctorUserId" = ${userId}`
        );

        await this.userModel.destroy({ where: { id: userId } });
        return { message: 'User deleted successfully' };
    }
}
