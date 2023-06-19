import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });
// Is a copy of src/config/postgres.config.ts

const pgConfig = {
  user: process.env.POSTGRES_USER?.trim(),
  password: process.env.POSTGRES_PASSWORD?.trim(),
  host: process.env.POSTGRES_KNOWN_HOST?.trim(),
  port: parseInt(process.env.POSTGRES_PORT?.trim() ?? '-1'),
  database: process.env.POSTGRES_DB_NAME?.trim(),
};

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: pgConfig.host,
  username: pgConfig.user,
  port: pgConfig.port,
  password: pgConfig.password,

  synchronize: false,
  logging: false,

  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  migrationsRun: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
