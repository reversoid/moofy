import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ListErrors } from 'src/errors/list.errors';
import { ListService } from 'src/modules/list/list.service';
import { User } from 'src/modules/user/entities/user.entity';

/**
 * Forbid users to view private lists
 *
 * @requires listId to be **number or undefined** in body or params
 * @requires user to be **User or undefined** in body or params
 * */
@Injectable()
export class PrivateListGuard implements CanActivate {
  constructor(private readonly listService: ListService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;

    const user = request['user'] as User;

    const listId = (request['query']?.['listId'] ||
      request['body']?.['listId']) as number | undefined;

    if (listId === undefined) {
      return true;
    }

    const list = await this.listService.getListById(Number(listId));

    if (!list) {
      throw new BadRequestException(ListErrors.WRONG_LIST_ID);
    }

    if (list?.is_public) {
      return true;
    }

    if (!user) {
      return false;
    }

    if (user.id === list.user.id) {
      return true;
    }

    return false;
  }
}
