import { Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Redis } from "ioredis";

type SubscribeCallback = (message: string, client: Redis) => void;

@Injectable({ scope: Scope.TRANSIENT })
export class RedisService {
  constructor(private config: ConfigService) {
    this._client = new Redis(this.config.get('redis.url'), {
      retryStrategy: times => Math.max(times * 100, 3000),
    });
  }

  private readonly _client: Redis;

  public get client() {
    return this._client;
  }

  createInstance() {
    return new Redis(this.config.get('redis.url'), {
      retryStrategy: times => Math.max(times * 100, 3000),
    })
  }
 
  async setJsonKeys(payload: { key: string, value: unknown }[]) {
    
    const client = this.createInstance();
   
    const pipeline = payload.reduce(
      (acc, entry) => acc.call('JSON.SET', entry.key, '$', JSON.stringify(entry.value)),
      client.pipeline()
    );

    const response = await pipeline.exec();

    return response
      .map(([error, value]) => !error && value);
  }

  async getJsonKeys(keys: string[]) {
    const client = this.createInstance();
   
    const pipeline = keys.reduce(
      (acc, key) => acc.call('JSON.GET', key),
      client.pipeline()
    );

    const response = await pipeline.exec();

    return response
      .map(([error, value]) => 
          !error && value && JSON.parse(value as string));
  }

  async getJson(key: string) {
    const client = this.createInstance();
    const value = await client.call('JSON.GET', key)

    if (!value) {
      return [];
    }
   
    return JSON.parse(value as string);
  }
}
