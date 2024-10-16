import { Controller } from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';

import { BinanceService } from './binance-service.service';
import { CustomRpcException } from '@app/common/errors/custom-rpc-exception';

@Controller()
export class BinanceServiceController {
  constructor(private readonly binanceService: BinanceService) {}

  @MessagePattern('health', Transport.RMQ)
  checkHealth() {
    return { status: true };
  }

  @MessagePattern('get-bitcoin-price', Transport.RMQ)
  public async getBitcoinPrice() {
    try {
      const res = await this.binanceService.getBitcoinPrice();
      return res;
    } catch (e) {
      throw new CustomRpcException(e);
    }
  }
}
