import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User, userSchema } from 'src/modules/user/models/user';

const idSchema = userSchema.shape.id;

export class UserIsProfileOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User | null = request.raw['user'];

    const id = idSchema.parse(request.params['id']);

    return id === user?.id;
  }
}
