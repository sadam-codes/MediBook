import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DbHealthService implements OnApplicationBootstrap {
    private readonly logger = new Logger('Database');

    constructor(@InjectConnection() private readonly sequelize: Sequelize) { }

    /** Sequelize `sync()` does not add new columns to existing tables; ensure these exist for avatar-in-DB. */
    private async ensureUserProfileImageColumns(): Promise<void> {
        try {
            await this.sequelize.query(
                'ALTER TABLE users ADD COLUMN IF NOT EXISTS "profileImageData" BYTEA',
            );
            await this.sequelize.query(
                'ALTER TABLE users ADD COLUMN IF NOT EXISTS "profileImageMime" VARCHAR(100)',
            );
        } catch (e) {
            this.logger.warn(`Profile image column ensure skipped: ${(e as Error).message}`);
        }
    }

    async onApplicationBootstrap(): Promise<void> {
        try {
            await this.sequelize.authenticate();
            this.logger.log('Connection established successfully ✅');
            await this.ensureUserProfileImageColumns();
        } catch (error) {
            this.logger.error(`Unable to connect to the database ❌  →  ${(error as Error).message}`);
        }
    }
}
