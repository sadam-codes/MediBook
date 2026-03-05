import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { UserRole } from '../../models/user.model';
import { Gender, BloodGroup } from '../../models/patient.model';
import { Unique } from 'sequelize-typescript';

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    @IsString()
    @IsOptional()
    profileImage?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    gender?: string;

    // Doctor Fields
    @IsString()
    @IsOptional()
    specialization?: string;

    @IsString()
    @IsOptional()
    licenseNumber?: string;

    @IsNumber()
    @IsOptional()
    experience?: number;

    @IsString()
    @IsOptional()
    qualification?: string;

    @IsString()
    @IsOptional()
    clinicName?: string;

    @IsString()
    @IsOptional()
    clinicAddress?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsNumber()
    @IsOptional()
    consultationFee?: number;

    @IsOptional()
    availableDays?: string[];

    @IsString()
    @IsOptional()
    startTime?: string;

    @IsString()
    @IsOptional()
    endTime?: string;

    @IsString()
    @IsOptional()
    breakTime?: string;

    @IsNumber()
    @IsOptional()
    appointmentDuration?: number;

    // Patient Fields
    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;

    @IsEnum(BloodGroup)
    @IsOptional()
    bloodGroup?: BloodGroup;

    @IsString()
    @IsOptional()
    allergies?: string;

    @IsString()
    @IsOptional()
    medicalHistory?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    emergencyContactName?: string;

    @IsString()
    @IsOptional()
    emergencyContactPhone?: string;
}
