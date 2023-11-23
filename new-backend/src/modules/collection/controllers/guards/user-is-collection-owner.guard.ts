import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/user/models/user';
import { PrimitiveCollectionService } from '../../services/primitive-collection.service';
import { WrongCollectionIdException } from '../../exceptions/wrong-collection-id.exception';

export class UserIsCollectionOwnerGuard implements CanActivate {
  constructor(
    private readonly primitiveCollectionService: PrimitiveCollectionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User | null = request.raw['user'];
    if (!user) {
      return false;
    }

    const id = Number(request.params['id']);
    if (Number.isNaN(id)) {
      throw new WrongCollectionIdException();
    }

    const collection = await this.primitiveCollectionService.getCollection(id);
    if (!collection) {
      return false;
    }

    return collection.user.id === user.id;
  }
}
