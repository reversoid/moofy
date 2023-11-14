import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export default registerAs('rmq', () =>
  rmqConfigSchema.parse({
    user: process.env.RMQ_USER?.trim(),
    password: process.env.RMQ_PASS?.trim(),
    port: parseInt(process.env.RMQ_PORT?.trim() ?? ''),
    exchangeName: process.env.RMQ_EXCHANGE?.trim(),
    host: process.env.RMQ_KNOWN_HOST?.trim(),
    queueName: process.env.RMQ_QUEUE_NAME?.trim(),
  }),
);

const rmqConfigSchema = z.object({
  user: z.string().min(1),
  password: z.string().min(1),
  port: z.number().int(),
  exchangeName: z.string().min(1),
  host: z.string().min(1),
  queueName: z.string().min(1),
});
