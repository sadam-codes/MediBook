import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() dto: CreateReviewDto, @Req() req: any) {
        return this.reviewsService.create(req.user.userId, dto);
    }

    @Get('doctor/:doctorUserId/summary')
    async getSummary(@Param('doctorUserId', ParseIntPipe) doctorUserId: number) {
        return this.reviewsService.getDoctorSummary(doctorUserId);
    }

    @Get('doctor/:doctorUserId')
    async getDoctorReviews(@Param('doctorUserId', ParseIntPipe) doctorUserId: number) {
        return this.reviewsService.getDoctorReviews(doctorUserId);
    }
}
