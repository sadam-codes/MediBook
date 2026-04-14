import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class ChatbotService {
    private readonly logger = new Logger(ChatbotService.name);
    private model: ChatOpenAI;

    constructor(
        private configService: ConfigService,
        private doctorsService: DoctorsService,
    ) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        this.model = new ChatOpenAI({
            openAIApiKey: apiKey,
            modelName: 'gpt-4o-mini',
            temperature: 0.7,
        });
    }

    async chat(message: string): Promise<string> {
        try {
            const doctors = await this.doctorsService.findAll();

            const doctorData = doctors.map(doc => ({
                id: doc.userId,
                name: doc.user?.fullName || 'N/A',
                image: doc.user?.profileImage || '',
                specialization: doc.specialization,
                experience: doc.experience,
                clinicName: doc.clinicName,
                city: doc.city,
                fee: doc.consultationFee,
                availability: doc.availableDays?.join(', ') || 'N/A',
            }));

            const template = `
            You are a professional medical assistant for **MediBook**. 
            **CRITICAL: Answer ONLY what is asked. Be direct, concise, and professional.**

            Available Doctors Data:
            {doctor_context}

            Guidelines:
            1. **Direct Answers**: Answer the user's question directly.
            2. **Doctor Suggestions**: If suggesting doctors, you MUST include a special tag for each doctor like this: [DOCTOR_CARD: id] where id is the doctor's ID from the data.
            3. **NO Markdown Images**: DO NOT use markdown syntax for images (like ![alt](url)) in your response. The [DOCTOR_CARD: id] tag will handle images automatically.
            4. **Greetings**: Short and helpful.
            5. **Format**: Use **Markdown** for regular text (bold, lists). 
            6. **No Prescriptions**: Do not provide medical prescriptions.

            User Query: {user_message}

            Assistant:`;

            const prompt = PromptTemplate.fromTemplate(template);
            const chain = prompt.pipe(this.model).pipe(new StringOutputParser());

            const response = await chain.invoke({
                doctor_context: JSON.stringify(doctorData, null, 2),
                user_message: message,
            });

            return response;
        } catch (error) {
            this.logger.error('Error in ChatbotService:', error);
            return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact support.";
        }
    }
}
