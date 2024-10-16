import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { TerminusModule } from '@nestjs/terminus';

import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';

import { CommonModule } from '@app/common';
import { createRabbitClient } from '@app/common/utils/client';

import { MicroserviceHealthIndicator } from './services/healthcheck.service';

import { PriceController } from './controllers/price.controller';

@Module({
  imports: [CommonModule, TerminusModule],

  exports: [MicroserviceHealthIndicator],
  controllers: [
    ApiGatewayController,
    PriceController,
  ],

  providers: [
    ApiGatewayService,
    MicroserviceHealthIndicator,
    createRabbitClient({
      name: 'BINANCE_SERVICE',
      queueConfigPath: 'services.binance.queue',
    }),
  ],
})
export class ApiGatewayModule {}
