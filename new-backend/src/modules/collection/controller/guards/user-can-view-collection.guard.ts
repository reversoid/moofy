import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/models/user';
import { WrongCollectionIdException } from '../../exceptions/wrong-collection-id.exception';
import { CollectionService } from '../../collection.service';
import { collectionSchema } from '../../models/collection';
import { ModuleRef } from '@nestjs/core';

const idSchema = collectionSchema.shape.id;

@Injectable()
export class UserCanViewCollectionGuard implements CanActivate {
  collectionService: CollectionService = this.moduleRef.get(CollectionService, {
    strict: false,
  });
  constructor(private readonly moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User | null = request.raw['user'];

    const id = idSchema.parse(request.params['id']);

    const collection = await this.collectionService.getCollectionById(id);
    if (!collection) {
      throw new WrongCollectionIdException();
    }

    if (collection.isPublic) {
      return true;
    }

    return collection.user.id === user?.id;
  }
}
