import { Test, TestingModule } from '@nestjs/testing';
import { BinanceServiceController } from './binance-service.controller';
import { BinanceServiceService } from './binance-service.service';

describe('BinanceServiceController', () => {
  let binanceServiceController: BinanceServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BinanceServiceController],
      providers: [BinanceServiceService],
    }).compile();

    binanceServiceController = app.get<BinanceServiceController>(BinanceServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(binanceServiceController.getHello()).toBe('Hello World!');
    });
  });
});
