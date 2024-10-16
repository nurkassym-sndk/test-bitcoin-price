import { NestApplication, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { BinanceServiceModule } from './binance-service.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(BinanceServiceModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const logger = new Logger(NestApplication.name);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.get<string>('rabbit.url')],
      queue: config.get<string>('services.binance.queue'),
      queueOptions: {
        durable: true,
      },
    },
  });

  const port = config.get('ports.binance');

  await app.startAllMicroservices();
  await app.listen(port);

  process.on('uncaughtException', async (error: any) => {
    logger.error('Uncaught Exception:', error?.message);
  });

  logger.log(`Application is listening on port: ${port}`);
}
bootstrap();
