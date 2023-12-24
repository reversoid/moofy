import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CollectionReviewService } from 'src/modules/collection-review/collection-review.service';
import { CollectionService } from 'src/modules/collection/collection.service';
import { User } from 'src/modules/user/models/user';
import { z } from 'zod';

const idSchema = z.coerce.number().int();

@Injectable()
export class ReviewInPersonalCollectionGuard implements CanActivate {
  reviewService = this.moduleRef.get(CollectionReviewService, {
    strict: false,
  });
  collectionService = this.moduleRef.get(CollectionService, {
    strict: false,
  });

  constructor(private readonly moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request['user'] as User | null;

    if (!user) {
      return false;
    }

    const reviewId = idSchema.parse(request.params['reviewId']);

    const personalCollection =
      await this.collectionService.getPersonalCollection(user.id);

    if (!personalCollection) {
      return false;
    }

    return this.reviewService.isReviewBelongsToCollection(
      reviewId,
      personalCollection.id,
    );
  }
}
