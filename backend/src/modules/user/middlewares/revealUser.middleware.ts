import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { AuthErrors } from 'src/errors/auth.errors';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

/** Get user entity from query parameter *?user=id* */
@Injectable()
export class RevealUserMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userQuery = req.query.user;
    let userId: number;
    if (!userQuery) {
      throw new HttpException('NO_USER_QUERY_SPECIFIED', 400);
    }
    if (userQuery instanceof Array) {
      userId = Number(userQuery[0]);
    } else {
      userId = Number(userQuery);
    }

    if (Number.isNaN(userId)) {
      throw new HttpException('MUST_BE_INTEGER_VALUE', 400);
    }

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new HttpException(AuthErrors.USER_DOES_NOT_EXIST, 400);
    }

    req.body.user = user;
    next();
  }
}
