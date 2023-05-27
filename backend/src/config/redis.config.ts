import { registerAs } from '@nestjs/config';

const getRedisHost = () => {
  const isProduction = process.env.NODE_ENV.trim() === 'prod';

  if (isProduction) {
    const productionHost = process.env.REDIS_KNOWN_HOST.trim();
    return productionHost;
  }

  const testHost = process.env.REDIS_TEST_KNOWN_HOST.trim();
  return testHost;
};

export default registerAs('redis', () => ({
  host: getRedisHost(),
  port: parseInt(process.env.REDIS_PORT?.trim()),
  password: process.env.REDIS_PASSWORD?.trim(),
}));
