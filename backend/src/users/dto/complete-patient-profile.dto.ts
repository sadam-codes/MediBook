import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { BloodGroup, Gender } from '../../models/patient.model';

export class CompletePatientProfileDto {
    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @IsOptional()
    @IsEnum(Gender, { message: `Gender must be one of: ${Object.values(Gender).join(', ')}` })
    gender?: Gender;

    @IsOptional()
    @IsEnum(BloodGroup, { message: `Blood group must be one of: ${Object.values(BloodGroup).join(', ')}` })
    bloodGroup?: BloodGroup;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    medicalHistory?: string;
}
