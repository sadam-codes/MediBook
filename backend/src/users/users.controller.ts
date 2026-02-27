import { Controller, Get, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

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
}
