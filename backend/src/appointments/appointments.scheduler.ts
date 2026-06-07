import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentsService } from './appointments.service';

@Injectable()
export class AppointmentsScheduler {
    private readonly logger = new Logger(AppointmentsScheduler.name);

    constructor(private readonly appointmentsService: AppointmentsService) {}

    @Cron(CronExpression.EVERY_HOUR)
    async handleAutoComplete() {
        const count = await this.appointmentsService.autoCompletePastAppointments();
        if (count > 0) {
            this.logger.log(`Auto-completed ${count} past appointment(s)`);
        }
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async handleReminders() {
        const count = await this.appointmentsService.sendUpcomingReminders();
        if (count > 0) {
            this.logger.log(`Sent ${count} appointment reminder(s)`);
        }
    }
}
