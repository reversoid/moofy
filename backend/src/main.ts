import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupS3 } from './shared/libs/S3/s3';
import { AppEnvironments } from './config/global.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  // setup swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Moofy API')
    .setDescription('Moofy project is used for creating collections of films')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  // setup s3
  setupS3({
    auth: {
      accessKeyId: configService.get<string>('s3.auth.accessKeyId'),
      secretAccessKey: configService.get<string>('s3.auth.secretAccessKey'),
    },
    Bucket: configService.get<string>('s3.Bucket'),
    debug:
      configService.get<AppEnvironments>('global.environment') ===
      AppEnvironments.dev,
  });

  // setup app middlewares and pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(cookieParser(configService.get<string>('secrets.cookie')));
  app.enableCors({
    origin: [
      'https://moofy.ru',
      'https://www.moofy.ru',
      'https://www.test.moofy.ru',
      'https://test.moofy.ru',
      'http://localhost:3000',
    ],
    credentials: true,
  });

  await app.listen(3333);
}
bootstrap();
