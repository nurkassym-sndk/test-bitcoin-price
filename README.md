<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```


# This application is designed to fetch the Bitcoin price from the Binance service.

The application consists of two microservices:
1. **`API Gateway`** – A router that directs requests to the appropriate microservices.

2. **`Binance Service`** – A microservice that provides the Bitcoin price from the Binance API:
Binance API documentation.

Additional Services:
- [RabbitMQ](https://www.rabbitmq.com/): Handles communication between microservices.
- [Redis Stack](https://redis.io/about/about-stack/): Used to cache the calculated Bitcoin price.


## API Gateway
This router accepts HTTP requests to fetch the Bitcoin(*BTC*) price:
```typescript
GET /price/bitcoin
```

**Documentation for all requests** (including examples and schemas) is available via **Swagger**:
```typescript
GET /docs
```

## Binance Service
This microservice retrieves Bitcoin pricing data from the Binance API ([Request Info](ttps://binance-docs.github.io/apidocs/spot/en/#symbol-order-book-ticker)).

Once the price is fetched, bid and ask values are calculated, adjusted using a commission set by the environment variable **`BINANCE_PRICE_COMMISSION`**, then mid price is calculated also.

By default, the Bitcoin price is updated every 10 seconds and stored as JSON in Redis. When the API Gateway requests the price, the cached version is returned.

The update frequency (default: 10 seconds) is managed via a CronJob, which can be configured using the environment variable **`BINANCE_PRICE_FREQUENCY`**.

Configuration Settings
The following settings must be defined in the *.env file*:

> An example of all environment variables is also available in the **.env.sample** file

```bash
GATEWAY_PORT=3000           # API Gateway port  
BINANCE_PORT=3001            # Binance Service port  

REDIS_URL=redis://localhost:6379      # Redis Stack URL  
RABBITMQ_URL=amqp://localhost:5672    # RabbitMQ URL  

BINANCE_SERVICE_QUEUE=binance         # Binance Service message queue  
GATEWAY_LISTENER_QUEUE=GATEWAY_LISTENER_QUEUE  # Gateway message queue  

BINANCE_BASE_URL=https://testnet.binance.vision   # Binance API base URL  
BINANCE_API_KEY=OXlYfbkZ6DwlednxyCBooCT4ex2Whj4iHGeXviZDUWfdtTBY4qkRfpEfrx01BkDP  
BINANCE_SECRET_KEY=7sYHxM2AGTvcEuf6KsQ94neODIrLZo2UNoNflXVPejSTyYvaWdkh8FqnkFLq6yhJ  

BINANCE_PRICE_FREQUENCY=20  # Bitcoin price update frequency (seconds)  
BINANCE_PRICE_COMMISSION=0.05  # Commission for bid and ask values  
```

## Docker Deployment

Each microservice has its own **`Dockerfile`**.

To start the application in Docker, run the following command in the project’s root directory:
```bash
docker compose up -d
```

Once the command executes successfully, the application will be fully deployed and ready for testing.

> By default, the API Gateway will be accessible on port 3000.