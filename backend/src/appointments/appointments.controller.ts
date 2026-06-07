import { Controller, Get, Patch, Param, Body, UseGuards, Query, Req, ForbiddenException, ParseIntPipe } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from '@nestjs/passport';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Get('admin')
    async getAllAppointments(@Req() req: any) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Only administrators can view all bookings.');
        }
        return this.appointmentsService.findAllForAdmin();
    }

    @Get('doctor/:id')
    async getDoctorAppointments(@Param('id') id: string, @Query('date') date?: string) {
        return this.appointmentsService.findByDoctor(Number(id), date);
    }

    @Get('doctor/:id/manage')
    async getDoctorManagedAppointments(@Param('id') id: string, @Req() req: any) {
        const doctorUserId = Number(id);
        if (req.user.role === 'doctor' && req.user.userId !== doctorUserId) {
            throw new ForbiddenException('You can only view your own appointments.');
        }
        if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
            throw new ForbiddenException('Not authorized.');
        }
        return this.appointmentsService.findManagedByDoctor(doctorUserId);
    }

    @Get('my')
    async getMyAppointments(@Req() req: any) {
        return this.appointmentsService.findByPatient(req.user.userId);
    }

    @Patch(':id/cancel')
    async cancelAppointment(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CancelAppointmentDto,
        @Req() req: any,
    ) {
        if (req.user.role !== 'patient') {
            throw new ForbiddenException('Only patients can cancel their appointments.');
        }
        return this.appointmentsService.cancelByPatient(id, req.user.userId, dto.reason);
    }

    @Patch(':id/reschedule')
    async rescheduleAppointment(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: RescheduleAppointmentDto,
        @Req() req: any,
    ) {
        if (req.user.role !== 'patient') {
            throw new ForbiddenException('Only patients can reschedule their appointments.');
        }
        return this.appointmentsService.rescheduleByPatient(id, req.user.userId, dto);
    }

    @Patch(':id/complete')
    async completeAppointment(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
    ) {
        if (req.user.role !== 'doctor') {
            throw new ForbiddenException('Only doctors can mark appointments complete.');
        }
        return this.appointmentsService.markComplete(id, req.user.userId);
    }

    @Patch(':id/no-show')
    async noShowAppointment(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
    ) {
        if (req.user.role !== 'doctor') {
            throw new ForbiddenException('Only doctors can mark no-show.');
        }
        return this.appointmentsService.markNoShow(id, req.user.userId);
    }
}
