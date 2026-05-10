import {
    Column,
    DataType,
    HasOne,
    Model,
    Table,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';
import { Doctor } from './doctor.model';
import { Patient } from './patient.model';
import { Admin } from './admin.model';

export enum UserRole {
    DOCTOR = 'doctor',
    PATIENT = 'patient',
    ADMIN = 'admin',
}
@Table({
    tableName: 'users',
    timestamps: true,
    defaultScope: {
        attributes: { exclude: ['profileImageData'] },
    },
})
export class User extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    declare fullName: string;

    @Column({
        type: DataType.STRING(512),
        allowNull: true,
    })
    declare profileImage: string;

    @Column({
        type: DataType.BLOB('long'),
        allowNull: true,
    })
    declare profileImageData: Buffer | null;

    @Column({
        type: DataType.STRING(100),
        allowNull: true,
    })
    declare profileImageMime: string | null;

    @Column({
        type: DataType.STRING(150),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false,
    })
    declare role: UserRole;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    declare isActive: boolean;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    @HasOne(() => Doctor, { onDelete: 'CASCADE' })
    declare doctor: Doctor;

    @HasOne(() => Patient, { onDelete: 'CASCADE' })
    declare patient: Patient;

    @HasOne(() => Admin, { onDelete: 'CASCADE' })
    declare admin: Admin;
}