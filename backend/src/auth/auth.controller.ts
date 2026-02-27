import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() dto: SignupDto) {
        console.log('--- NEW SIGNUP REQUEST ---');
        console.log('SIGNUP DTO:', dto);
        try {
            const result = await this.authService.signup(dto);
            console.log('✅ SIGNUP SUCCESS:', JSON.stringify(result, null, 2));
            return result;
        } catch (e: any) {
            console.log('❌ SIGNUP ERROR:', e?.response || e?.message || e);
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