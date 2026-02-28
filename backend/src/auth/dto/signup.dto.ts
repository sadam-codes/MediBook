import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { UserRole } from '../../models/user.model';
import { Gender, BloodGroup } from '../../models/patient.model';
import { Unique } from 'sequelize-typescript';

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    // Shared Fields
    @IsString()
    @IsOptional()
    phoneNumber?: string;

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
    bio?: string;

    @IsNumber()
    @IsOptional()
    consultationFee?: number;

    // Patient Fields
    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;

    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;

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

    // Admin Fields
    @IsString()
    @IsOptional()
    department?: string;
}
