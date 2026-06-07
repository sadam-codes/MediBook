import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Headers,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('checkout')
    @UseGuards(AuthGuard('jwt'))
    async createCheckout(@Body() dto: CreateCheckoutDto, @Req() req: any) {
        return this.paymentsService.createCheckoutSession(dto, req.user.userId);
    }

    @Get('verify')
    @UseGuards(AuthGuard('jwt'))
    async verify(@Query('session_id') sessionId: string, @Req() req: any) {
        if (!sessionId) {
            return { paid: false };
        }
        return this.paymentsService.verifySession(sessionId, req.user.userId);
    }

    @Post('cancel/:appointmentId')
    @UseGuards(AuthGuard('jwt'))
    async cancelPending(
        @Param('appointmentId', ParseIntPipe) appointmentId: number,
        @Req() req: any,
    ) {
        return this.paymentsService.cancelPendingAppointment(
            appointmentId,
            req.user.userId,
        );
    }

    @Get('admin')
    @UseGuards(AuthGuard('jwt'))
    async getAllPayments(@Req() req: any) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Only administrators can view all payments.');
        }
        return this.paymentsService.findAllForAdmin();
    }

    @Get('my')
    @UseGuards(AuthGuard('jwt'))
    async getMyPayments(@Req() req: any) {
        if (req.user.role !== 'patient') {
            throw new ForbiddenException('Only patients can view their payment history here.');
        }
        return this.paymentsService.findByPatient(req.user.userId);
    }

    @Get('doctor')
    @UseGuards(AuthGuard('jwt'))
    async getDoctorPayments(@Req() req: any) {
        if (req.user.role !== 'doctor') {
            throw new ForbiddenException('Only doctors can view their received payments.');
        }
        return this.paymentsService.findByDoctor(req.user.userId);
    }

    @Post('webhook')
    async webhook(
        @Req() req: RawBodyRequest<Request>,
        @Headers('stripe-signature') signature: string,
    ) {
        const rawBody = req.rawBody;

        if (!rawBody || !signature) {
            return { received: false };
        }

        return this.paymentsService.handleWebhook(rawBody, signature);
    }
}
