import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @InjectModel(User) private userModel: typeof User,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'sadam@123',
        });
    }

    async validate(payload: any) {
        const user = await this.userModel.findByPk(payload.sub);
        if (!user || (!user.isActive)) {
            throw new UnauthorizedException('User is inactive or deleted');
        }
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}
