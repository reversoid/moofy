import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/models/user';
import { CollectionService } from '../../collection.service';
import { ModuleRef } from '@nestjs/core';
import { z } from 'zod';

const idSchema = z.coerce.number();

@Injectable()
export class UserIsCollectionOwnerGuard implements CanActivate {
  collectionService: CollectionService = this.moduleRef.get(CollectionService, {
    strict: false,
  });
  constructor(private readonly moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User | null = request.raw['user'];
    if (!user) {
      return false;
    }

    const id = idSchema.parse(request.params['id']);

    const collection = await this.collectionService.getCollectionById(id);
    if (!collection) {
      return false;
    }

    return collection.user.id === user.id;
  }
}
