import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/user/models/user';
import { PrimitiveCollectionService } from '../../services/primitive-collection.service';
import { WrongCollectionIdException } from '../../exceptions/wrong-collection-id.exception';

export class UserCanViewCollectionGuard implements CanActivate {
  constructor(
    private readonly primitiveCollectionService: PrimitiveCollectionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User | null = request.raw['user'];

    const id = Number(request.params['id']);
    if (Number.isNaN(id)) {
      throw new WrongCollectionIdException();
    }

    const collection = await this.primitiveCollectionService.getCollection(id);
    if (!collection) {
      throw new WrongCollectionIdException();
    }

    if (collection.is_public) {
      return true;
    }

    return collection.user.id === user?.id;
  }
}
