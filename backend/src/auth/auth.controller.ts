import { Controller, Post, Body, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { multerConfig } from '../config/multer.config';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    @UseInterceptors(FileInterceptor('profileImage', multerConfig))
    async signup(
        @Body() dto: SignupDto,
        @UploadedFile() file?: any
    ) {
        try {
            const result = await this.authService.signup(dto, file);
            return result;
        } catch (e: any) {
            throw e;
        }
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        try {
            return await this.authService.login(dto);
        } catch (e: any) {
            throw new BadRequestException(e?.response || e?.message || 'Login failed');
        }
    }
}