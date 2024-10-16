import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
} from '@nestjs/terminus';

import { MicroserviceHealthIndicator } from './services/healthcheck.service';

@Controller()
export class ApiGatewayController {
  constructor(
    private health: HealthCheckService,
    private microserviceHealthIndicator: MicroserviceHealthIndicator,
  ) {}

  @Get('health')
  @HealthCheck()
  async healthCheck() {
    return this.health.check([
      () => this.microserviceHealthIndicator.isHealthy('BINANCE_SERVICE'),
    ]);
  }
}
