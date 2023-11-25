import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User, userSchema } from 'src/modules/user/models/user';

const idSchema = userSchema.shape.id;

export class UserIsNotProfileOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User | null = request.raw['user'];

    const id = idSchema.parse(request.params['id']);

    if (!user?.id) {
      return false;
    }

    return id !== user.id;
  }
}
