import { Global, Module } from '@nestjs/common';
import { GlobalConfig } from './global.config';

@Global()
@Module({
  providers: [GlobalConfig],
  exports: [GlobalConfig],
})
export class GlobalModule {}
