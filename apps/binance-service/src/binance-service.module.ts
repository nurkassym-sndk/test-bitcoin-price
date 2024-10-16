import { Module} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from '@app/common';

import { BinanceServiceController } from './binance-service.controller';
import { BinanceService } from './binance-service.service';

import { FetchPriceJob } from './jobs/price.job';

@Module({
  imports: [
    CommonModule,
    ScheduleModule.forRoot()
  ],
  controllers: [BinanceServiceController],
  providers: [
    BinanceService,
    FetchPriceJob,
  ],
})
export class BinanceServiceModule {}
