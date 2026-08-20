import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { applyAppSecurity } from './common/security/apply-app-security';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true, limit: '2mb' }));
  app.setGlobalPrefix('');
  applyAppSecurity(app);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
