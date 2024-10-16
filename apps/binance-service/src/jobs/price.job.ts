import { Injectable, Logger, OnModuleInit  } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import { CronJob } from 'cron';

import { BinanceService } from '../binance-service.service';

@Injectable()
export class FetchPriceJob implements OnModuleInit {
  constructor(
    private config: ConfigService,

    private readonly binanceService: BinanceService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  private readonly logger = new Logger(BinanceService.name);

  async onModuleInit() {
    // Convert the string to an integer (value in seconds!!) with base 10
    const intervalInSeconds = parseInt(this.config.get<string>('binance.frequency'), 10) || 10;

    const job = new CronJob(`*/${intervalInSeconds} * * * * *`, async () => {
      try {
        await this.binanceService.updateBitcoinPrice();
        this.logger.log('Bitcoin price updated successfully');

      } catch (err) {
        this.logger.error(`Failed to update Bitcoin price: ${err.message}`);
      }
    });

    this.schedulerRegistry.addCronJob('fetch-bitcoin-price', job);
    job.start();
  }
}