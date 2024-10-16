import {
  Controller,
  Get,
  Param,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { GetTokenPriceResponseDto } from '@app/common/dto/price.dto';

import {
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { CustomHttpException } from '@app/common/errors/custom-http-exception';
import { promisifyObservable } from '@app/common/utils/observable';
  
@Controller('price')
@ApiTags('price')
export class PriceController {
  constructor(
    @Inject('BINANCE_SERVICE') private readonly binanceClient: ClientProxy,
  ) {}

  @Get('bitcoin')
  @ApiOperation({
    summary: 'Get Bitcoin price from Binance',
  })
  @ApiResponse({
    status: 200,
    description: 'Current Bitcoin price',
    type: [GetTokenPriceResponseDto],
  })
  public async getBitcoinPrice() {
    try {
      const res = await promisifyObservable(
        this.binanceClient.send('get-bitcoin-price', {}),
      );
      return res || [];
    } catch (e) {
      throw new CustomHttpException(e);
    }
  }
}
  