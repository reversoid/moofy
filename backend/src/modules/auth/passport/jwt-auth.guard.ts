import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthErrors } from 'src/errors/auth.errors';
import { User } from 'src/modules/user/entities/user.entity';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new HttpException(AuthErrors.UNAUTHORIZED, 401);
    }
    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isJWTCorrect = await super.canActivate(context);
    if (!isJWTCorrect) return false;

    const request = context.switchToHttp().getRequest();

    const userId = request.user;

    const user = await this.userRepository.findOneBy({ id: userId });

    request.user = user;
    return Boolean(user);
  }
}
