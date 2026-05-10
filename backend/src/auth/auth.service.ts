import {
    Injectable,
    BadRequestException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { User, UserRole } from '../models/user.model';
import { Doctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';
import { Admin } from '../models/admin.model';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectConnection() private readonly sequelize: Sequelize,
        @InjectModel(User) private userModel: typeof User,
        @InjectModel(Doctor) private doctorModel: typeof Doctor,
        @InjectModel(Patient) private patientModel: typeof Patient,
        @InjectModel(Admin) private adminModel: typeof Admin,
        private jwtService: JwtService,
    ) { }

    async signup(signupDto: SignupDto, file?: any) {
        const t = await this.sequelize.transaction();
        try {
            const {
                fullName, email, password,
                phoneNumber, gender, specialization, licenseNumber, experience,
                qualification, clinicName, clinicAddress, city, country, consultationFee,
                availableDays, startTime, endTime, breakTime, appointmentDuration,
                dateOfBirth, bloodGroup, allergies, medicalHistory, address,
                emergencyContactName, emergencyContactPhone
            } = signupDto;

            let profileImage: string | null = signupDto.profileImage ?? null;
            let profileImageData: Buffer | null = null;
            let profileImageMime: string | null = null;

            if (file?.buffer?.length) {
                profileImageData = file.buffer;
                profileImageMime = file.mimetype;
                profileImage = null;
            }

            const existingUser = await this.userModel.findOne({
                where: { email },
                transaction: t,
            });
            if (existingUser) throw new BadRequestException('User with this email already exists');

            const hashedPassword = await bcrypt.hash(password, 10);

            let assignedRole = signupDto.role || UserRole.PATIENT;

            if (assignedRole === 'admin') {
                throw new BadRequestException('Admin accounts cannot be created via public signup.');
            }

            const user = await this.userModel.create(
                {
                    fullName,
                    email,
                    password: hashedPassword,
                    role: assignedRole,
                    profileImage,
                    profileImageData,
                    profileImageMime,
                },
                { transaction: t },
            );

            if (profileImageData) {
                await user.update({ profileImage: `/users/${user.id}/avatar` }, { transaction: t });
            }

            let hasPatientProfile = false;
            let hasDoctorProfile = false;

            if (assignedRole === 'doctor') {
                await this.doctorModel.create(
                    {
                        userId: user.id,
                        specialization,
                        licenseNumber,
                        experience,
                        qualification,
                        clinicName,
                        clinicAddress,
                        city,
                        country,
                        consultationFee,
                        phoneNumber,
                        gender,
                        availableDays,
                        startTime,
                        endTime,
                        breakTime,
                        appointmentDuration,
                    },
                    { transaction: t }
                );
                hasDoctorProfile = true;
            } else if (assignedRole === 'patient') {
                await this.patientModel.create(
                    {
                        userId: user.id,
                        dateOfBirth,
                        gender,
                        bloodGroup,
                        allergies,
                        medicalHistory,
                        address,
                        city,
                        country,
                        emergencyContactName,
                        emergencyContactPhone,
                        phoneNumber,
                    },
                    { transaction: t }
                );
                hasPatientProfile = true;
            }

            await t.commit();

            const payload = { email: user.email, sub: user.id, role: user.role };

            return {
                message: 'Signup successful',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    fullName: user.fullName,
                    profileImage: user.profileImage,
                    hasPatientProfile,
                    hasDoctorProfile,
                },
                access_token: this.jwtService.sign(payload),
            };
        } catch (err: unknown) {
            await t.rollback();
            const errorMessage = err instanceof Error ? err.message : String(err);
            this.logger.error(`Signup failed: ${errorMessage}`);

            if (err instanceof BadRequestException) throw err;
            throw new InternalServerErrorException('Signup failed');
        }
    }

    async login(loginDto: LoginDto) {
        try {
            const { email, password } = loginDto;

            const user = await this.userModel.findOne({
                where: { email },
                include: [this.patientModel, this.doctorModel]
            });
            if (!user) throw new BadRequestException('Invalid credentials');

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

            if (!user.isActive) throw new BadRequestException('Account is disabled');

            const payload = { email: user.email, sub: user.id, role: user.role };

            return {
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    fullName: user.fullName,
                    profileImage: user.profileImage,
                    hasPatientProfile: !!user.patient,
                    hasDoctorProfile: !!user.doctor
                },
                access_token: this.jwtService.sign(payload),
            };
        } catch (err: unknown) {
            if (err instanceof BadRequestException) throw err;
            throw new InternalServerErrorException('Login failed');
        }
    }
}