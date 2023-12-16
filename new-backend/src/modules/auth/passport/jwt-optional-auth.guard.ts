import { ExecutionContext, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/modules/user/user.service';
import { userIdSchema } from './jwt-auth.guard';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  private userService: UserService = this.moduleRef.get(UserService, {
    strict: false,
  });

  constructor(private moduleRef: ModuleRef) {
    super();
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      return null;
    }
    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isJWTCorrect = await super.canActivate(context);
    if (!isJWTCorrect) return false;

    const request = context.switchToHttp().getRequest();

    const userId = request.user as unknown;
    const numericUserId = userIdSchema.nullish().parse(userId);

    if (numericUserId) {
      const user = await this.userService.getUserById(numericUserId);
      request.user = user;
    }

    return true;
  }
}
