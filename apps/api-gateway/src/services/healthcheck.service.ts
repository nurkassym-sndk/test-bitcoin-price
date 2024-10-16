import { Injectable, Inject } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { ClientProxy } from '@nestjs/microservices';
import { promisifyObservable } from '@app/common/utils/observable';

@Injectable()
export class MicroserviceHealthIndicator extends HealthIndicator {
  constructor(
    @Inject('BINANCE_SERVICE') private readonly binanceClient: ClientProxy,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = await this.pingMicroservice(key);
    const result = this.getStatus(key, isHealthy);

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('MicroserviceCheck failed', result);
  }

  private async pingMicroservice(key: string): Promise<boolean> {
    try {
      switch (key) {
        case 'API_GATEWAY':
          return true;
        case 'BINANCE_SERVICE':
          return this.checkHealthOfMicroservices(this.binanceClient);
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  private async checkHealthOfMicroservices(client: ClientProxy) {
    try {
      const res = await promisifyObservable(client.send('health', 'ping'));
      return res?.status;
    } catch (_) {
      return false;
    }
  }
}
