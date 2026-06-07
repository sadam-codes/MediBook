import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DbHealthService implements OnApplicationBootstrap {
    private readonly logger = new Logger('Database');

    constructor(@InjectConnection() private readonly sequelize: Sequelize) { }

    private async runSql(label: string, sql: string): Promise<void> {
        try {
            await this.sequelize.query(sql);
        } catch (e) {
            this.logger.warn(`${label} skipped: ${(e as Error).message}`);
        }
    }

    /** Sequelize `sync()` does not add new columns to existing tables. */
    private async ensureUserProfileImageColumns(): Promise<void> {
        await this.runSql(
            'users.profileImageData',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS "profileImageData" BYTEA',
        );
        await this.runSql(
            'users.profileImageMime',
            'ALTER TABLE users ADD COLUMN IF NOT EXISTS "profileImageMime" VARCHAR(100)',
        );
    }

    private async ensureAppointmentPaymentColumns(): Promise<void> {
        await this.runSql(
            'enum_appointments_paymentStatus',
            `DO $$ BEGIN
                CREATE TYPE "enum_appointments_paymentStatus" AS ENUM ('pending', 'paid', 'failed');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;`,
        );

        await this.runSql(
            'appointments.stripeSessionId',
            'ALTER TABLE appointments ADD COLUMN IF NOT EXISTS "stripeSessionId" VARCHAR(255)',
        );

        await this.runSql(
            'appointments.paymentStatus',
            `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS "paymentStatus" "enum_appointments_paymentStatus" DEFAULT 'pending'`,
        );

        await this.runSql(
            'appointments.paymentStatus backfill',
            `UPDATE appointments SET "paymentStatus" = 'pending' WHERE "paymentStatus" IS NULL`,
        );
    }

    private async ensurePaymentsTable(): Promise<void> {
        await this.runSql(
            'enum_payments_status',
            `DO $$ BEGIN
                CREATE TYPE "enum_payments_status" AS ENUM ('pending', 'paid', 'failed', 'cancelled');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;`,
        );

        await this.runSql(
            'payments table',
            `CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                "appointmentId" INTEGER NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
                "patientId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                "doctorUserId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10, 2) NOT NULL,
                currency VARCHAR(10) NOT NULL DEFAULT 'pkr',
                status "enum_payments_status" NOT NULL DEFAULT 'pending',
                "stripeSessionId" VARCHAR(255),
                "stripePaymentIntentId" VARCHAR(255),
                "stripeCustomerEmail" VARCHAR(255),
                "paymentMethod" VARCHAR(50),
                "cardBrand" VARCHAR(30),
                "cardLast4" VARCHAR(4),
                "receiptUrl" TEXT,
                "appointmentDate" DATE NOT NULL,
                "appointmentTime" VARCHAR(10) NOT NULL,
                "paidAt" TIMESTAMP WITH TIME ZONE,
                "failureReason" TEXT,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
            )`,
        );
    }

    private async ensureAppointmentLifecycleColumns(): Promise<void> {
        await this.runSql(
            'appointments.no_show enum',
            `DO $$ BEGIN
                ALTER TYPE "enum_appointments_status" ADD VALUE IF NOT EXISTS 'no_show';
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;`,
        );

        await this.runSql(
            'appointments.reminderSentAt',
            'ALTER TABLE appointments ADD COLUMN IF NOT EXISTS "reminderSentAt" TIMESTAMP WITH TIME ZONE',
        );
        await this.runSql(
            'appointments.completedAt',
            'ALTER TABLE appointments ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP WITH TIME ZONE',
        );
        await this.runSql(
            'appointments.cancellationReason',
            'ALTER TABLE appointments ADD COLUMN IF NOT EXISTS "cancellationReason" TEXT',
        );
    }

    private async ensureReviewsTable(): Promise<void> {
        await this.runSql(
            'reviews table',
            `CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                "appointmentId" INTEGER NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
                "patientId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                "doctorUserId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
            )`,
        );
    }

    async onApplicationBootstrap(): Promise<void> {
        try {
            await this.sequelize.authenticate();
            this.logger.log('Connection established successfully ✅');

            await this.ensureUserProfileImageColumns();
            await this.ensureAppointmentPaymentColumns();
            await this.ensureAppointmentLifecycleColumns();
            await this.ensurePaymentsTable();
            await this.ensureReviewsTable();

            this.logger.log('Schema patches applied ✅');
        } catch (error) {
            this.logger.error(`Unable to connect to the database ❌  →  ${(error as Error).message}`);
        }
    }
}
