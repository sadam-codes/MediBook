import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
    tableName: 'doctors',
    timestamps: true,
})
export class Doctor extends Model {
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
        unique: true,
    })
    declare userId: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare specialization: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    declare licenseNumber: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
    })
    declare experience: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    declare qualification: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare clinicName: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    declare clinicAddress: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare city: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare country: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    declare consultationFee: number;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
    })
    declare phoneNumber: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
    })
    declare gender: string;

    @Column({
        type: DataType.JSON,
        allowNull: true,
        comment: 'Available days (e.g. ["Mon", "Tue"])',
    })
    declare availableDays: string[];

    @Column({
        type: DataType.STRING(10),
        allowNull: true,
    })
    declare startTime: string;

    @Column({
        type: DataType.STRING(10),
        allowNull: true,
    })
    declare endTime: string;

    @Column({
        type: DataType.STRING(10),
        allowNull: true,
    })
    declare breakTime: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'Duration in minutes',
    })
    declare appointmentDuration: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    declare isAvailable: boolean;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    // Association
    @BelongsTo(() => User, { onDelete: 'CASCADE' })
    declare user: User;
}
