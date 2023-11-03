import { registerAs } from '@nestjs/config';

export default registerAs('rmq', () => ({
  user: process.env.RABBITMQ_USER?.trim(),
  password: process.env.RABBITMQ_PASS?.trim(),
  port: parseInt(process.env.RABBITMQ_PORT?.trim()),
  exchangeName: process.env.RABBITMQ_EXCHANGE?.trim(),
  host: process.env.RABBITMQ_HOST?.trim(),
}));
