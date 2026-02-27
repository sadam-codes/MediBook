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
})
export class User extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare firstName: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare lastName: string;

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

    @HasOne(() => Doctor)
    declare doctor: Doctor;

    @HasOne(() => Patient)
    declare patient: Patient;

    @HasOne(() => Admin)
    declare admin: Admin;
}