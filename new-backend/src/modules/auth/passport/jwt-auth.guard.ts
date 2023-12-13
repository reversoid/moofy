import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/modules/user/user.service';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import { ModuleRef } from '@nestjs/core';
import { userSchema } from 'src/modules/user/models/user';

export const userIdSchema = userSchema.shape.id;

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private userService: UserService = this.moduleRef.get(UserService, {
    strict: false,
  });

  constructor(private moduleRef: ModuleRef) {
    super();
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isJWTCorrect = await super.canActivate(context);

    if (!isJWTCorrect) return false;

    const request = context.switchToHttp().getRequest();

    const userId = request.user as unknown;

    const numericUserId = userIdSchema.parse(userId);

    const user = await this.userService.getUserById(numericUserId);

    request.user = user;
    return Boolean(user);
  }
}
