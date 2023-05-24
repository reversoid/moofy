import { registerAs } from '@nestjs/config';

export default registerAs('postgres', () => ({
  user: process.env.POSTGRES_USER?.trim(),
  password: process.env.POSTGRES_PASSWORD?.trim(),
  host: process.env.POSTGRES_KNOWN_HOST?.trim(), // TODO check for env
  port: parseInt(process.env.POSTGRES_PORT?.trim()),
}));
