import { Module } from '@nestjs/common';
import { PersonalReviewService } from './personal-review.service';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { PersonalReviewRepository } from './personal-review.repository';

@Module({
  providers: [PersonalReviewService, PrismaService, PersonalReviewRepository],
})
export class PersonalReviewModule {}
