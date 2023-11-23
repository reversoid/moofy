import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/user/models/user';
import { CollectionService } from '../../collection.service';
import { collectionSchema } from '../../models/collection';

const idSchema = collectionSchema.shape.id;

export class UserIsCollectionOwnerGuard implements CanActivate {
  constructor(private readonly collectionService: CollectionService) {}

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
