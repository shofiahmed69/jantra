import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import express, { Express } from 'express';
import { AppModule } from './app.module';

let cached: Express;

async function bootstrap(): Promise<Express> {
  if (cached) return cached;

  const expressApp = express();
  expressApp.use(json({ limit: '10mb' }));
  expressApp.use(urlencoded({ extended: true, limit: '10mb' }));

  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);
  app.setGlobalPrefix('');
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();

  cached = expressApp;
  return expressApp;
}

export default async function handler(req: express.Request, res: express.Response) {
  const app = await bootstrap();
  return app(req, res);
}
