import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_KNOWN_HOST?.trim(),
  port: parseInt(process.env.REDIS_PORT?.trim()),
  password: process.env.REDIS_PASSWORD?.trim(),
}));
