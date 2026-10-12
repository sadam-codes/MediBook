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
  try {
    if (!isAppInitialized) {
      await createNestServer(server);
      isAppInitialized = true;
    }
    return server(req, res);
  } catch (error: any) {
    console.error('NestJS Initialization Error on Vercel:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Initialization Failed on Vercel',
      error: error?.message || String(error),
      envCheck: {
        DB_HOST: process.env.DB_HOST ? 'Present' : 'MISSING',
        DB_PORT: process.env.DB_PORT ? 'Present' : 'MISSING',
        DB_USER: process.env.DB_USER ? 'Present' : 'MISSING',
        DB_PASS: process.env.DB_PASS ? 'Present' : 'MISSING',
        DB_NAME: process.env.DB_NAME ? 'Present' : 'MISSING',
        JWT_SECRET: process.env.JWT_SECRET ? 'Present' : 'MISSING',
      },
    });
  }
}
