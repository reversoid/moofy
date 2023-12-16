import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { z } from 'zod';
import { User } from 'src/modules/user/models/user';
import { CollectionService } from 'src/modules/collection/collection.service';

export const reviewIdSchema = z.coerce.number();

@Injectable()
export class UserIsReviewOwnerGuard implements CanActivate {
  collectionReviewService = this.moduleRef.get(CollectionService, {
    strict: false,
  });

  constructor(private readonly moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user: User | null = request['user'];
    if (!user) {
      return false;
    }

    const id = reviewIdSchema.parse(request.params['reviewId']);

    const collection =
      await this.collectionReviewService.getCollectionByReviewId(id);

    if (!collection) {
      throw new NotFoundException();
    }

    return collection.user.id === user.id;
  }
}
