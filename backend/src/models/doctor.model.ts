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
        allowNull: true,
    })
    declare licenseNumber: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Years of experience',
    })
    declare experience: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare bio: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Consultation fee in local currency',
    })
    declare consultationFee: number;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
    })
    declare phoneNumber: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
        comment: 'Whether the doctor is currently accepting appointments',
    })
    declare isAvailable: boolean;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    // Association
    @BelongsTo(() => User)
    declare user: User;
}
