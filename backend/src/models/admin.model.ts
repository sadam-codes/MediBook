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

export enum AdminPermissions {
    SUPER_ADMIN = 'super_admin',
    MANAGE_DOCTORS = 'manage_doctors',
    MANAGE_PATIENTS = 'manage_patients',
    MANAGE_APPOINTMENTS = 'manage_appointments',
    VIEW_REPORTS = 'view_reports',
}

@Table({
    tableName: 'admins',
    timestamps: true,
})
export class Admin extends Model {
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
        allowNull: true,
        comment: 'Department the admin belongs to',
    })
    declare department: string;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false,
        defaultValue: [AdminPermissions.VIEW_REPORTS],
        comment: 'List of admin permissions',
    })
    declare permissions: AdminPermissions[];

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this admin has super admin privileges',
    })
    declare isSuperAdmin: boolean;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
    })
    declare phoneNumber: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    // Association
    @BelongsTo(() => User)
    declare user: User;
}
