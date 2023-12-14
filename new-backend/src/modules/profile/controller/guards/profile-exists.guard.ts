import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { UserService } from 'src/modules/user/user.service';
import { z } from 'zod';

const idSchema = z.coerce.number().int();

@Injectable()
export class ProfileExistsGuard implements CanActivate {
  userService = this.moduleRef.get(UserService, { strict: false });

  constructor(private readonly moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const id = idSchema.parse(request.params['id']);
    const user = await this.userService.getUserById(id);
    return Boolean(user);
  }
}
