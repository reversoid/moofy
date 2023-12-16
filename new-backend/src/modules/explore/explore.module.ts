import { Module } from '@nestjs/common';
import { ExploreController } from './controller/explore.controller';
import { ExploreService } from './explore.service';
import { ProfileModule } from '../profile/profile.module';
import { CollectionModule } from '../collection/collection.module';

@Module({
  controllers: [ExploreController],
  providers: [ExploreService],
  imports: [ProfileModule, CollectionModule],
})
export class ExploreModule {}
