import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import globalConfig, { AppEnvironments } from 'src/config/global.config';

type GlobalConfigType = ConfigType<typeof globalConfig>;

@Injectable()
export class GlobalConfig implements GlobalConfigType {
  constructor(
    @Inject(globalConfig.KEY)
    private config: GlobalConfigType,
  ) {}

  environment = AppEnvironments[this.config.environment];
}
