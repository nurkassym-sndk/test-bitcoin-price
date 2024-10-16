export default () => ({
  envName: process.env.ENV_NAME || 'dev',
  ports: {
    gateway: parseInt(process.env.GATEWAY_PORT, 10) || 3000,
    binance: parseInt(process.env.BINANCE_PORT, 10) || 3001,
  },

  rabbit: {
    url: process.env.RABBITMQ_URL,
  },

  redis: {
    url: process.env.REDIS_URL,
  },

  services: {
    gateway: {
      queue: process.env.GATEWAY_LISTENER_QUEUE,
    },

    binance: {
      queue: process.env.BINANCE_SERVICE_QUEUE,
    },
  },

  binance: {
    baseUrl: process.env.BINANCE_BASE_URL,

    apiKey: process.env.BINANCE_API_KEY,
    secretKey: process.env.BINANCE_SECRET_KEY,

    frequency: process.env.BINANCE_PRICE_FREQUENCY,
    commission: parseFloat(process.env.BINANCE_PRICE_COMMISION) || 0.01,
  },
});
