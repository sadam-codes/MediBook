import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DbHealthService implements OnApplicationBootstrap {
    private readonly logger = new Logger('Database');

    constructor(@InjectConnection() private readonly sequelize: Sequelize) { }

    async onApplicationBootstrap(): Promise<void> {
        try {
            await this.sequelize.authenticate();
            this.logger.log('Connection established successfully ✅');
        } catch (error) {
            this.logger.error(`Unable to connect to the database ❌  →  ${(error as Error).message}`);
        }
    }
}
