import fastifyCookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { AppModule } from './app.module';
import { AppEnvironments } from './config/global.config';
import { setupS3 } from './shared/utils/s3/s3';

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

  app.enableCors({
    origin: [
      'https://moofy.ru',
      'https://www.moofy.ru',
      'https://www.test.moofy.ru',
      'https://test.moofy.ru',
      'http://localhost:3000',
      'https://localhost:3000',
      'http://localhost:4200',
      'https://localhost:4200',
    ],
    credentials: true,
  });

  await app.register(fastifyCookie, {
    secret: configService.get<string>('secrets.cookie'),
  });

  await app.register(multipart);

  if (
    configService.getOrThrow<AppEnvironments>('global.environment') ===
    AppEnvironments.dev
  ) {
    await app.listen(3333);
  } else {
    await app.listen(3333, '0.0.0.0');
  }
}
bootstrap();
