import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
    imports: [ConfigModule, DoctorsModule],
    controllers: [ChatbotController],
    providers: [ChatbotService],
    exports: [ChatbotService],
})
export class ChatbotModule { }
