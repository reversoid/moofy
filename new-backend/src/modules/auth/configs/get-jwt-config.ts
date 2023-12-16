import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import secretsConfig from 'src/config/secrets.config';

export function getJwtConfig(): JwtModuleAsyncOptions {
  return {
    imports: [ConfigModule],
    inject: [secretsConfig.KEY],
    useFactory: (
      config: ConfigType<typeof secretsConfig>,
    ): JwtModuleOptions => ({
      secret: config.jwt,
    }),
  };
}
