import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly userService: UserService) {
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

    const userId = request.user;

    const user = await this.userService.getUserById(userId);

    request.user = user;
    return true;
  }
}
