import { ConfigModule, ConfigType } from '@nestjs/config';
import { IRMQServiceAsyncOptions } from 'nestjs-rmq';
import rmqConfig from '../rmq.config';

export const getRMQConfig = (): IRMQServiceAsyncOptions => {
  return {
    imports: [ConfigModule],
    inject: [rmqConfig.KEY],
    useFactory: (config: ConfigType<typeof rmqConfig>) => {
      return {
        exchangeName: config.exchangeName,
        connections: [
          {
            login: config.user,
            password: config.password,
            port: config.port,
            host: config.host,
          },
        ],
      };
    },
  };
};
