import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);

    constructor(private configService: ConfigService) {}

    async sendReminder(phone: string, message: string): Promise<boolean> {
        const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
        const fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');

        if (!accountSid || !authToken || !fromNumber) {
            this.logger.debug(`SMS skipped (not configured): ${phone} — ${message}`);
            return false;
        }

        try {
            const body = new URLSearchParams({
                To: this.normalizePhone(phone),
                From: fromNumber,
                Body: message,
            });

            const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
            const response = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: body.toString(),
                },
            );

            if (!response.ok) {
                const errorText = await response.text();
                this.logger.warn(`Twilio SMS failed: ${errorText}`);
                return false;
            }

            return true;
        } catch (error) {
            this.logger.warn(`SMS send error: ${(error as Error).message}`);
            return false;
        }
    }

    private normalizePhone(phone: string): string {
        const digits = phone.replace(/\D/g, '');
        if (digits.startsWith('92')) {
            return `+${digits}`;
        }
        if (digits.startsWith('0')) {
            return `+92${digits.slice(1)}`;
        }
        return phone.startsWith('+') ? phone : `+${digits}`;
    }
}
