import { RpcException } from '@nestjs/microservices';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Spot } from '@binance/connector-typescript';

import { RedisService } from '@app/common/services/redis.service';

import { GetTokenPriceResponseDto } from '@app/common/dto/price.dto';
import { BTC_UCD } from '@app/common/constants/binance.constants';


@Injectable()
export class BinanceService {
  private binanceConnector: Spot;
  private commission: number;

  constructor(
    private config: ConfigService,
    private readonly redis: RedisService,
  ) {
    const baseURL = this.config.get<string>('binance.baseUrl');

    const apiKey = this.config.get<string>('binance.apiKey');
    const secretKey = this.config.get<string>('binance.secretKey');

    this.binanceConnector = new Spot(apiKey, secretKey, { baseURL });

    this.commission = this.config.get<number>('binance.commission');
  }

  private readonly logger = new Logger(BinanceService.name);

  async getBitcoinPrice(): Promise<GetTokenPriceResponseDto> {
    try {
      const [cachedPriceinfo] = await this.getCache();

      if (cachedPriceinfo) {
        return cachedPriceinfo;
      }

      return this.getBinanceBitcoinPrice();
    } catch (err) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `${err?.message ? err.message : err}`,
      });
    }
  }

  async updateBitcoinPrice() {
    const result = await this.getBinanceBitcoinPrice();

    await this.setCache(result);
  }

  private async getBinanceBitcoinPrice(): Promise<GetTokenPriceResponseDto> {
    try {
      const result = {
        symbol: BTC_UCD,
        ask: 0,
        bid: 0,
        midPrice: 0,
      };

      const response = await this.binanceConnector.symbolOrderBookTicker({
        symbol: BTC_UCD,
      });

      if (Array.isArray(response)) {
        result.ask = +response[0]?.askPrice * this.commission;
        result.bid = +response[0]?.bidPrice * this.commission;

      } else {
        result.ask = +response?.askPrice * this.commission
        result.bid = +response?.bidPrice * this.commission;
      }

      result.midPrice = (result.ask + result.bid) / 2;

      return result;
    } catch (err) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `${err?.message ? err.message : err}`,
      });
    }
  }

  private getCache(): Promise<any> {
    return this.redis.getJsonKeys([BTC_UCD]);
  }

  private async setCache(payload: GetTokenPriceResponseDto): Promise<void> {
    await this.redis.setJsonKeys([
      {
        key: BTC_UCD,
        value: payload,
      },
    ]);
  }
}
