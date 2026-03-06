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

export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
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

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @BelongsTo(() => User, { foreignKey: 'patientId', onDelete: 'CASCADE' })
    declare patient: User;

    @BelongsTo(() => User, { foreignKey: 'doctorUserId', onDelete: 'CASCADE' })
    declare doctorUser: User;
}
