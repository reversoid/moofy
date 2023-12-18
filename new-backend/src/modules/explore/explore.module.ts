import { Module } from '@nestjs/common';
import { ExploreController } from './controller/explore.controller';
import { ExploreService } from './explore.service';
import { ProfileModule } from '../profile/profile.module';
import { CollectionModule } from '../collection/collection.module';
import { ExploreRepository } from './explore.repository';
import { PrismaService } from 'src/shared/utils/prisma-service';

@Module({
  controllers: [ExploreController],
  providers: [ExploreService, ExploreRepository, PrismaService],
  imports: [ProfileModule, CollectionModule],
})
export class ExploreModule {}
