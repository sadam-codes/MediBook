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
import { Appointment } from './appointment.model';

@Table({
    tableName: 'reviews',
    timestamps: true,
})
export class Review extends Model {
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
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare rating: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare comment: string | null;

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
