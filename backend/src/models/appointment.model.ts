import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    CreatedAt,
    UpdatedAt,
    BelongsTo,
    HasOne,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Doctor } from './doctor.model';
import { Patient } from './patient.model';
import { Review } from './review.model';

export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
    NO_SHOW = 'no_show',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}

@Table({
    tableName: 'appointments',
    timestamps: true,
})
export class Appointment extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare patientId: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare doctorUserId: number;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    declare date: string;

    @Column({
        type: DataType.STRING(10),
        allowNull: false,
    })
    declare time: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    declare fee: number;

    @Column({
        type: DataType.ENUM(...Object.values(AppointmentStatus)),
        allowNull: false,
        defaultValue: AppointmentStatus.PENDING,
    })
    declare status: AppointmentStatus;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare notes: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    declare stripeSessionId: string | null;

    @Column({
        type: DataType.ENUM(...Object.values(PaymentStatus)),
        allowNull: false,
        defaultValue: PaymentStatus.PENDING,
    })
    declare paymentStatus: PaymentStatus;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare reminderSentAt: Date | null;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare completedAt: Date | null;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare cancellationReason: string | null;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @BelongsTo(() => User, { foreignKey: 'patientId', onDelete: 'CASCADE' })
    declare patient: User;

    @BelongsTo(() => User, { foreignKey: 'doctorUserId', onDelete: 'CASCADE' })
    declare doctorUser: User;

    @HasOne(() => Review, { foreignKey: 'appointmentId' })
    declare review: Review;
}
