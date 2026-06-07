import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCheckoutDto {
    @IsInt()
    @Min(1)
    doctorId: number;

    @IsString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    time: string;

    @IsNumber()
    @Min(0)
    fee: number;

    @IsOptional()
    @IsString()
    notes?: string;
}
