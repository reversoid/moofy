import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      return undefined;
    }
    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isJWTCorrect = await super.canActivate(context);
    if (!isJWTCorrect) return false;

    const request = context.switchToHttp().getRequest();

    const userId = request.user;
    if (!userId) {
      return true;
    }

    const user = await this.userRepository.findOneBy({ id: userId });

    request.user = user;
    return true;
  }
}
