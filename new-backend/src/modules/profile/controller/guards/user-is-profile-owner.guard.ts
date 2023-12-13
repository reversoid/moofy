import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/user/models/user';
import { z } from 'zod';

const idSchema = z.coerce.number().int();

export class UserIsProfileOwnerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User | null = request['user'];

    const id = idSchema.parse(request.params['id']);

    return id === user?.id;
  }
}
