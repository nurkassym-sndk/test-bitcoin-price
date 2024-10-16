import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { WsAdapter } from '@nestjs/platform-ws';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const adapter = new FastifyAdapter({ bodyLimit: 10048576 });
  const app = await NestFactory.create<NestFastifyApplication>(
    ApiGatewayModule,
    adapter,
  );

  const config = app.get(ConfigService);
  const logger = new Logger(NestApplication.name);

  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [config.get<string>('rabbit.url')],
      queue: config.get<string>('services.gateway.queue'),
      queueOptions: {
        durable: true,
      },
    },
  });

  const swagger = new DocumentBuilder()
    .setTitle('Test Bitcoin Price API')
    .build();

  const document = SwaggerModule.createDocument(app, swagger);

  SwaggerModule.setup('docs', app, document);

  await app.startAllMicroservices();
  await app.listen(config.get('ports.gateway'), '0.0.0.0');

  process.on('uncaughtException', async (error: any) => {
    logger.error('Uncaught Exception:', error?.message);
  });

  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
