import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';

const server: Express = express();
let isAppInitialized = false;

async function createNestServer(expressInstance: Express) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
    { rawBody: true },
  );

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  return app;
}

// Local development server
if (!process.env.VERCEL) {
  async function bootstrap() {
    const app = await createNestServer(server);
    const port = process.env.PORT ?? 5000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  }
  bootstrap();
}

// Vercel Serverless Function entry point
export default async function handler(req: any, res: any) {
  if (!isAppInitialized) {
    await createNestServer(server);
    isAppInitialized = true;
  }
  return server(req, res);
}
