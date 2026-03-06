import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
    constructor(private readonly chatbotService: ChatbotService) { }

    @Post('chat')
    async chat(@Body('message') message: string) {
        const response = await this.chatbotService.chat(message);
        return { response };
    }
}
