import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Use ValidationPipe globally
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
