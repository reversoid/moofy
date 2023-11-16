import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';
import { setupS3 } from './shared/utils/s3/s3';
import { AppEnvironments } from './config/global.config';
import { ConfigService } from '@nestjs/config';

patchNestJsSwagger();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const configService = app.get<ConfigService>(ConfigService);

  // setup swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Moofy API')
    .setDescription('Moofy project is used for creating collections of films')
    .setVersion('2.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  // setup s3
  setupS3({
    auth: {
      accessKeyId: configService.getOrThrow<string>('s3.auth.accessKeyId'),
      secretAccessKey: configService.getOrThrow<string>(
        's3.auth.secretAccessKey',
      ),
    },
    Bucket: configService.getOrThrow<string>('s3.Bucket'),
    debug:
      configService.get<AppEnvironments>('global.environment') ===
      AppEnvironments.dev,
  });

  // global pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableCors({
    origin: [
      'https://moofy.ru',
      'https://www.moofy.ru',
      'https://www.test.moofy.ru',
      'https://test.moofy.ru',
      'http://localhost:3000',
      'https://localhost:3000',
    ],
    credentials: true,
  });

  await app.register(fastifyCookie, {
    secret: configService.get<string>('secrets.cookie'),
  });

  await app.listen(3000);
}
bootstrap();
