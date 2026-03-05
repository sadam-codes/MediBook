import { Controller, Post, Get, Body, UseGuards, Query, Req, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    async create(@Body() bookingData: any, @Req() req: any) {
        // Assume patientId comes from the logged in user
        return this.appointmentsService.create({
            ...bookingData,
            patientId: req.user.userId
        });
    }

    @Get('doctor/:id')
    async getDoctorAppointments(@Param('id') id: string, @Query('date') date?: string) {
        // Only the doctor or admins should really see this, but for now we let users see it to filter slots
        return this.appointmentsService.findByDoctor(Number(id), date);
    }

    @Get('my')
    async getMyAppointments(@Req() req: any) {
        return this.appointmentsService.findByPatient(req.user.userId);
    }
}
