import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/user/models/user';
import { CollectionCommentService } from '../../collection-comment.service';
import { WrongCommentIdException } from '../../exceptions/wrong-comment-id.exception';

export class UserIsCommentCreator implements CanActivate {
  constructor(private readonly commentService: CollectionCommentService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User | null = request.raw['user'];
    if (!user) {
      return false;
    }

    const id = Number(request.params['commentId']);
    if (Number.isNaN(id)) {
      throw new WrongCommentIdException();
    }

    const comment = await this.commentService.getCommentById(id);
    if (!comment) {
      return false;
    }

    return comment.user.id === user.id;
  }
}
