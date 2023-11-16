import { Module } from '@nestjs/common';
import { ExploreController } from './explore.controller';

@Module({
  controllers: [ExploreController],
})
export class ExploreModule {}
