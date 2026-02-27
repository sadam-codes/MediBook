import { Controller, Get, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('doctors')
@UseGuards(AuthGuard('jwt'))
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) { }

    @Get()
    async findAll() {
        return this.doctorsService.findAll();
    }
}
