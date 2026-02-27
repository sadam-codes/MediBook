import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DbHealthService } from './db-health.service';
import { User } from './models/user.model';
import { Doctor } from './models/doctor.model';
import { Patient } from './models/patient.model';
import { Admin } from './models/admin.model';
import { AuthModule } from './auth/auth.module';
import { DoctorsModule } from './doctors/doctors.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        models: [User, Doctor, Patient, Admin],
        autoLoadModels: true,
        synchronize: true,
        dialectOptions:
          config.get<string>('DB_SSL') === 'true'
            ? { ssl: { require: true, rejectUnauthorized: false } }
            : {},
        logging: false,
      }),
    }),
    AuthModule,
    DoctorsModule,
    UsersModule,
  ],
  providers: [DbHealthService],
})
export class AppModule { }