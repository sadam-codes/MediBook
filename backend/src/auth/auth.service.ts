import {
    Injectable,
    BadRequestException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { User } from '../models/user.model';
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

    async signup(signupDto: SignupDto) {
        const t = await this.sequelize.transaction();
        try {
            const {
                firstName, lastName, email, password, role,
                phoneNumber,
                specialization, licenseNumber, experience, bio, consultationFee,
                dateOfBirth, gender, bloodGroup, allergies, medicalHistory, address, emergencyContactName, emergencyContactPhone,
                department
            } = signupDto;

            if (role === 'admin') {
                throw new BadRequestException('Admin accounts cannot be created via public signup. Please contact the system administrator.');
            }

            const existingUser = await this.userModel.findOne({
                where: { email },
                transaction: t,
            });
            if (existingUser) throw new BadRequestException('User with this email already exists');

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await this.userModel.create(
                { firstName, lastName, email, password: hashedPassword, role },
                { transaction: t },
            );

            if (role === 'doctor') {
                await this.doctorModel.create(
                    {
                        userId: user.id,
                        specialization: specialization || 'General',
                        phoneNumber,
                        licenseNumber,
                        experience,
                        bio,
                        consultationFee
                    },
                    { transaction: t },
                );
            } else if (role === 'patient') {
                await this.patientModel.create({
                    userId: user.id,
                    phoneNumber,
                    dateOfBirth,
                    gender,
                    bloodGroup,
                    allergies,
                    medicalHistory,
                    address,
                    emergencyContactName,
                    emergencyContactPhone
                }, { transaction: t });
            } else if (role === 'admin') {
                await this.adminModel.create({
                    userId: user.id,
                    department,
                    phoneNumber
                }, { transaction: t });
            } else {
                throw new BadRequestException('Invalid role');
            }

            await t.commit();

            const payload = { email: user.email, sub: user.id, role: user.role };

            return {
                message: 'Signup successful',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
                access_token: this.jwtService.sign(payload),
            };
        } catch (err: any) {
            await t.rollback();
            this.logger.error(err?.message || String(err), err?.stack);

            if (err instanceof BadRequestException) throw err;

            if (err?.name?.includes('Sequelize')) {
                throw new BadRequestException(err?.message || 'Database error');
            }

            throw new InternalServerErrorException('Signup failed');
        }
    }

    async login(loginDto: LoginDto) {
        try {
            const { email, password } = loginDto;

            const user = await this.userModel.findOne({ where: { email } });
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
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
                access_token: this.jwtService.sign(payload),
            };
        } catch (err: any) {
            this.logger.error(err?.message || String(err), err?.stack);
            if (err instanceof BadRequestException) throw err;
            throw new InternalServerErrorException('Login failed');
        }
    }
}