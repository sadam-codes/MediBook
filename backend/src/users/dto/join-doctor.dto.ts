import { IsString, IsOptional, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class JoinDoctorDto {
    @IsString()
    @IsNotEmpty()
    specialization: string;

    @IsOptional()
    @IsString()
    licenseNumber?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    experience?: number;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    consultationFee?: number;

    @IsOptional()
    @IsString()
    phoneNumber?: string;
}
