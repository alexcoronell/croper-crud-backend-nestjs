import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Set global prefix for all routes (e.g., http://localhost:3000/api/v1/user)
  app.setGlobalPrefix('api/v1');

  app.use(cookieParser()); // Enable cookie parsing

  // 2. Enable CORS so your Frontend (Exercise 2) can connect without issues
  app.enableCors({ credentials: true });

  // 3. Global Validation Pipe
  // whitelist: true removes any property not defined in the DTO
  // forbidNonWhitelisted: true throws an error if extra properties are sent
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  // 4. Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Croper Management API')
    .setDescription('Technical test backend - Product and User Management')
    .setVersion('1.0')
    .addBearerAuth() // Adds JWT support in Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // 5. Port management
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(
    `Swagger documentation available at: http://localhost:${port}/docs`,
  );
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
