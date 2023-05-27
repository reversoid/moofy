import { registerAs } from '@nestjs/config';

const getPostgresHost = () => {
  const isProduction = process.env.NODE_ENV.trim() === 'prod';

  if (isProduction) {
    const productionHost = process.env.POSTGRES_KNOWN_HOST.trim();
    return productionHost;
  }

  const testHost = process.env.POSTGRES_TEST_KNOWN_HOST.trim();
  return testHost;
};

export default registerAs('postgres', () => ({
  user: process.env.POSTGRES_USER?.trim(),
  password: process.env.POSTGRES_PASSWORD?.trim(),
  host: getPostgresHost(),
  port: parseInt(process.env.POSTGRES_PORT?.trim()),
  dbName: process.env.POSTGRES_DB_NAME?.trim(),
}));
