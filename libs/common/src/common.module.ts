import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CommonService } from './common.service';
import configuration from './config/configuration';
import { RedisService } from './services/redis.service';

@Module({
  providers: [CommonService, RedisService],
  exports: [CommonService, RedisService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [configuration],

      expandVariables: true,
      isGlobal: true,
    }),
  ],
})
export class CommonModule {}
