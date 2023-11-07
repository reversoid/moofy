import { registerAs } from '@nestjs/config';

export default registerAs('rmq', () => ({
  user: process.env.RMQ_USER?.trim(),
  password: process.env.RMQ_PASS?.trim(),
  port: parseInt(process.env.RMQ_PORT?.trim()),
  exchangeName: process.env.RMQ_EXCHANGE?.trim(),
  host: process.env.RMQ_KNOWN_HOST?.trim(),
  queueName: process.env.RMQ_QUEUE_NAME?.trim(),
}));
