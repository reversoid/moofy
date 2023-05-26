import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import _globalConfig, { AppEnvironments } from '../global.config';
import postgresConfig from '../postgres.config';

export const getPostgresConfig = (): TypeOrmModule => {
  return {
    imports: [ConfigModule],
    inject: [postgresConfig.KEY, _globalConfig.KEY],
    useFactory: (
      pgConfig: ConfigType<typeof postgresConfig>,
      globalConfig: ConfigType<typeof _globalConfig>,
    ): TypeOrmModuleOptions => {
      return {
        type: 'postgres',
        host: pgConfig.host,
        username: pgConfig.user,
        port: pgConfig.port,
        password: pgConfig.password,
        database: pgConfig.dbName,

        synchronize: false,
        logging:
          globalConfig.environment === AppEnvironments.dev ||
          globalConfig.environment === AppEnvironments.test,

        entities: ['dist/**/*entity.js'],
        migrationsRun: true,
        migrations: ['dist/db/migrations/*.js'],
      };
    },
  };
};
