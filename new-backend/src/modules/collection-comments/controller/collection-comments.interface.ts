import { GetCommentsResponse } from './responses/get-comments.response';
import { LikeUnlikeCommentResponse } from './responses/like-unlike-comment.response';
import { SendCommentResponse } from './responses/send-comment.response';

export interface ICollectionCommentsController {
  getComments(...args: any[]): Promise<GetCommentsResponse>;

  sendComment(...args: any[]): Promise<SendCommentResponse>;

  removeComment(...args: any[]): Promise<void>;

  likeComment(...args: any[]): Promise<LikeUnlikeCommentResponse>;

  unlikeComment(...args: any[]): Promise<LikeUnlikeCommentResponse>;
}
