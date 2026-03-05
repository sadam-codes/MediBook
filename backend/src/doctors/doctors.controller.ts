import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) { }

    @Get()
    async findAll() {
        return this.doctorsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.doctorsService.findOne(Number(id));
    }
}
