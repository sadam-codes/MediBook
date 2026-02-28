import { Controller, Get, Post, Patch, Delete, Body, UseGuards, ForbiddenException, Request, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { JoinDoctorDto } from './dto/join-doctor.dto';
import { CompletePatientProfileDto } from './dto/complete-patient-profile.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(@Request() req: any) {
        // Basic Role Guarding - ensure only admins can view all users
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Only administrators can access this information.');
        }
        return this.usersService.findAll();
    }

    @Post('join-doctor')
    async joinDoctor(@Request() req: any, @Body() dto: JoinDoctorDto) {
        return this.usersService.joinDoctor(req.user.userId, dto);
    }

    @Post('complete-patient-profile')
    async completePatientProfile(@Request() req: any, @Body() dto: CompletePatientProfileDto) {
        return this.usersService.completePatientProfile(req.user.userId, dto);
    }

    @Patch(':id/role')
    async updateRole(@Request() req: any, @Param('id') id: number, @Body('role') role: string) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Only administrators can change roles.');
        }
        return this.usersService.updateRole(id, role);
    }

    @Delete(':id')
    async deleteUser(@Request() req: any, @Param('id') id: number) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Only administrators can delete users.');
        }
        return this.usersService.delete(id);
    }
}
