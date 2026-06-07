import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { fn, col } from 'sequelize';
import { Review } from '../models/review.model';
import { Appointment, AppointmentStatus, PaymentStatus } from '../models/appointment.model';
import { User } from '../models/user.model';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectModel(Review)
        private reviewModel: typeof Review,
        @InjectModel(Appointment)
        private appointmentModel: typeof Appointment,
    ) {}

    async create(patientId: number, dto: CreateReviewDto) {
        const appointment = await this.appointmentModel.findByPk(dto.appointmentId);

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        if (appointment.patientId !== patientId) {
            throw new ForbiddenException('You can only review your own appointments');
        }

        if (
            appointment.status !== AppointmentStatus.CONFIRMED &&
            appointment.status !== AppointmentStatus.COMPLETED
        ) {
            throw new BadRequestException('Only completed or confirmed appointments can be reviewed');
        }

        if (appointment.paymentStatus !== PaymentStatus.PAID) {
            throw new BadRequestException('Payment must be completed before reviewing');
        }

        const existing = await this.reviewModel.findOne({
            where: { appointmentId: dto.appointmentId },
        });

        if (existing) {
            throw new BadRequestException('You have already reviewed this appointment');
        }

        const review = await this.reviewModel.create({
            appointmentId: dto.appointmentId,
            patientId,
            doctorUserId: appointment.doctorUserId,
            rating: dto.rating,
            comment: dto.comment ?? null,
        });

        if (appointment.status !== AppointmentStatus.COMPLETED) {
            await appointment.update({ status: AppointmentStatus.COMPLETED, completedAt: new Date() });
        }

        return review;
    }

    async getDoctorSummary(doctorUserId: number) {
        const stats = (await this.reviewModel.findOne({
            where: { doctorUserId },
            attributes: [
                [fn('AVG', col('rating')), 'averageRating'],
                [fn('COUNT', col('id')), 'reviewCount'],
            ],
            raw: true,
        })) as { averageRating: string | null; reviewCount: string } | null;

        const reviewCount = Number(stats?.reviewCount ?? 0);
        const averageRating = reviewCount
            ? Math.round(Number(stats?.averageRating) * 10) / 10
            : null;

        return { averageRating, reviewCount };
    }

    async getDoctorReviews(doctorUserId: number) {
        const summary = await this.getDoctorSummary(doctorUserId);

        const reviews = await this.reviewModel.findAll({
            where: { doctorUserId },
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                as: 'patient',
                attributes: ['fullName', 'profileImage'],
            }],
        });

        return { ...summary, reviews };
    }

    async getRatingMapForDoctors(doctorUserIds: number[]) {
        if (!doctorUserIds.length) {
            return new Map<number, { averageRating: number; reviewCount: number }>();
        }

        const rows = (await this.reviewModel.findAll({
            where: { doctorUserId: doctorUserIds },
            attributes: [
                'doctorUserId',
                [fn('AVG', col('rating')), 'averageRating'],
                [fn('COUNT', col('id')), 'reviewCount'],
            ],
            group: ['doctorUserId'],
            raw: true,
        })) as unknown as Array<{ doctorUserId: number; averageRating: string; reviewCount: string }>;

        const map = new Map<number, { averageRating: number; reviewCount: number }>();

        for (const row of rows) {
            map.set(Number(row.doctorUserId), {
                averageRating: Math.round(Number(row.averageRating) * 10) / 10,
                reviewCount: Number(row.reviewCount),
            });
        }

        return map;
    }
}
