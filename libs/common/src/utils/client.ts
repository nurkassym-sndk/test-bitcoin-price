import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

interface ClientOptions {
  name: string;
  queueConfigPath: string;
}

export function createRabbitClient(options: ClientOptions) {
  return {
    provide: options.name,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {

      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [config.get('rabbit.url')],
          queue: config.get(options.queueConfigPath),
          queueOptions: {
            durable: true
          } 
        }
      })
    },
  };
}