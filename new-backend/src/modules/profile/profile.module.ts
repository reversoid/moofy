import { Module } from '@nestjs/common';
import { ProfileController } from './controller/profile.controller';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';
import { EventsModule } from '../events/events.module';
import { CollectionModule } from '../collection/collection.module';
import { UserModule } from '../user/user.module';
import { PrismaService } from 'src/shared/utils/prisma-service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository, PrismaService],
  imports: [EventsModule, CollectionModule, UserModule],
  exports: [ProfileService],
})
export class ProfileModule {}
