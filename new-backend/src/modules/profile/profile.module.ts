import { Module } from '@nestjs/common';
import { ProfileController } from './controller/profile.controller';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';
import { EventsModule } from '../events/events.module';
import { CollectionModule } from '../collection/collection.module';
import { UserModule } from '../user/user.module';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { PersonalProfileController } from './controller/personal-profile.controller';
import { PersonalReviewModule } from '../personal-review/personal-review.module';

@Module({
  controllers: [ProfileController, PersonalProfileController],
  providers: [ProfileService, ProfileRepository, PrismaService],
  imports: [EventsModule, CollectionModule, UserModule, PersonalReviewModule],
  exports: [ProfileService],
})
export class ProfileModule {}
