import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    CreatedAt,
    UpdatedAt,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Doctor } from './doctor.model';
import { Patient } from './patient.model';
import { Appointment } from './appointment.model';

export enum PaymentRecordStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
}

@Table({
    tableName: 'payments',
    timestamps: true,
})
export class Payment extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @ForeignKey(() => Appointment)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: true,
    })
    declare appointmentId: number;

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
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    declare amount: number;

    @Column({
        type: DataType.STRING(10),
        allowNull: false,
        defaultValue: 'pkr',
    })
    declare currency: string;

    @Column({
        type: DataType.ENUM(...Object.values(PaymentRecordStatus)),
        allowNull: false,
        defaultValue: PaymentRecordStatus.PENDING,
    })
    declare status: PaymentRecordStatus;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    declare stripeSessionId: string | null;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    declare stripePaymentIntentId: string | null;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    declare stripeCustomerEmail: string | null;

    @Column({
        type: DataType.STRING(50),
        allowNull: true,
    })
    declare paymentMethod: string | null;

    @Column({
        type: DataType.STRING(30),
        allowNull: true,
    })
    declare cardBrand: string | null;

    @Column({
        type: DataType.STRING(4),
        allowNull: true,
    })
    declare cardLast4: string | null;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare receiptUrl: string | null;

    @Column({
        type: DataType.DATEONLY,
        allowNull: false,
    })
    declare appointmentDate: string;

    @Column({
        type: DataType.STRING(10),
        allowNull: false,
    })
    declare appointmentTime: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare paidAt: Date | null;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare failureReason: string | null;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @BelongsTo(() => Appointment, { onDelete: 'CASCADE' })
    declare appointment: Appointment;

    @BelongsTo(() => User, { foreignKey: 'patientId', onDelete: 'CASCADE' })
    declare patient: User;

    @BelongsTo(() => User, { foreignKey: 'doctorUserId', onDelete: 'CASCADE' })
    declare doctorUser: User;
}
