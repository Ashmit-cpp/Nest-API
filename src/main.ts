import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import rawBodyMiddleware from './middlewares/rawBody.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.use(rawBodyMiddleware());

  // Load environment variables
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
  const PORT = process.env.PORT || 3000;

  const options = new DocumentBuilder()
    .setTitle('EcommerceApp')
    .setDescription('Ecommerce App')
    .setVersion('1.0')
    .addServer(BACKEND_URL, 'Deployment environment')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
