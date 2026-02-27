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

export enum BloodGroup {
    A_POS = 'A+',
    A_NEG = 'A-',
    B_POS = 'B+',
    B_NEG = 'B-',
    AB_POS = 'AB+',
    AB_NEG = 'AB-',
    O_POS = 'O+',
    O_NEG = 'O-',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

@Table({
    tableName: 'patients',
    timestamps: true,
})
export class Patient extends Model {
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
        type: DataType.DATEONLY,
        allowNull: true,
    })
    declare dateOfBirth: string;

    @Column({
        type: DataType.ENUM(...Object.values(Gender)),
        allowNull: true,
    })
    declare gender: Gender;

    @Column({
        type: DataType.ENUM(...Object.values(BloodGroup)),
        allowNull: true,
    })
    declare bloodGroup: BloodGroup;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
    })
    declare phoneNumber: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
        comment: 'Known allergies',
    })
    declare allergies: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
        comment: 'Existing medical conditions',
    })
    declare medicalHistory: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    declare address: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: true,
        comment: 'Name of emergency contact person',
    })
    declare emergencyContactName: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
        comment: 'Phone number of emergency contact person',
    })
    declare emergencyContactPhone: string;

    @CreatedAt
    declare createdAt: Date;

    @UpdatedAt
    declare updatedAt: Date;

    // Association
    @BelongsTo(() => User)
    declare user: User;
}
