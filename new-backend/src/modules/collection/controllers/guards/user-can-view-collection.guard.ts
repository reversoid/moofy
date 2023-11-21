import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/user/models/user';
import { PrimitiveCollectionService } from '../../services/primitive-collection.service';

export class UserCanViewCollectionGuard implements CanActivate {
  constructor(
    private readonly primitiveCollectionService: PrimitiveCollectionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User | null = request.raw['user'];

    const id = request.params['id'];
    if (Number.isNaN(id)) {
      return false;
    }

    const collection = await this.primitiveCollectionService.getCollection(id);
    if (!collection) {
      return false;
    }

    if (collection.is_public) {
      return true;
    }

    return collection.user.id === user?.id;
  }
}
