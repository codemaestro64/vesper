import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create the app instance
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ensures API routes don't collide with next.js ssg
  app.setGlobalPrefix('api', {
    exclude: ['/'], // Reserve this part so that the web ssg will be served here
  });

  // Allow inline scripts
  app.use(helmet({ contentSecurityPolicy: false }));

  // Enable Graceful Shutdown
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 6. CORS Configuration
  const origin = configService.get<string>(
    'CORS_ORIGIN',
    'http://localhost:5173',
  );

  app.enableCors({
    origin,
    credentials: true,
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 API is running on: http://localhost:${port}/api`);
  logger.log(`📂 Serving Static Frontend from the root path`);
}

bootstrap().catch((err) => {
  console.error('💥 Error during bootstrap', err);
  process.exit(1);
});
