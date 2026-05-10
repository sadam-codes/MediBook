import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    UseGuards,
    ForbiddenException,
    Request,
    Param,
    NotFoundException,
    StreamableFile,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { JoinDoctorDto } from './dto/join-doctor.dto';
import { CompletePatientProfileDto } from './dto/complete-patient-profile.dto';
import { multerConfig } from '../config/multer.config';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':id/avatar')
    async getAvatar(@Param('id') id: string): Promise<StreamableFile> {
        const out = await this.usersService.getAvatar(+id);
        if (!out) throw new NotFoundException();
        return new StreamableFile(out.buffer, {
            type: out.mime,
            disposition: 'inline',
        });
    }

    @Patch('me/profile-image')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('profileImage', multerConfig))
    async updateMyProfileImage(@Request() req: any, @UploadedFile() file?: { buffer: Buffer; mimetype: string }) {
        if (!file?.buffer?.length) {
            throw new BadRequestException('profileImage file is required (JPEG, PNG, or WebP, max 3MB)');
        }
        const { profileImage } = await this.usersService.updateProfileImage(req.user.userId, file);
        return { message: 'Profile image updated', user: { profileImage } };
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll(@Request() req: any) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Only administrators can access this information.');
        }
        return this.usersService.findAll();
    }

    @Post('join-doctor')
    @UseGuards(AuthGuard('jwt'))
    async joinDoctor(@Request() req: any, @Body() dto: JoinDoctorDto) {
        return this.usersService.joinDoctor(req.user.userId, dto);
    }

    @Post('complete-patient-profile')
    @UseGuards(AuthGuard('jwt'))
    async completePatientProfile(@Request() req: any, @Body() dto: CompletePatientProfileDto) {
        return this.usersService.completePatientProfile(req.user.userId, dto);
    }

    @Patch(':id/role')
    @UseGuards(AuthGuard('jwt'))
    async updateRole(@Request() req: any, @Param('id') id: number, @Body('role') role: string) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Only administrators can change roles.');
        }
        return this.usersService.updateRole(id, role);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteUser(@Request() req: any, @Param('id') id: number) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Only administrators can delete users.');
        }
        return this.usersService.delete(id);
    }
}
