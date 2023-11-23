import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { Comment } from '../models/comment';
import { CommentWithInfo } from '../models/comment-with-info';
import { CommentSocialStats } from '../models/comment-social-stats';

export interface ICollectionCommentsController {
  getComments(...args: any[]): Promise<PaginatedData<CommentWithInfo>>;

  sendComment(...args: any[]): Promise<CommentWithInfo>;

  removeComment(...args: any[]): Promise<{ id: Comment['id'] }>;

  likeComment(...args: any[]): Promise<CommentSocialStats>;

  unlikeComment(...args: any[]): Promise<CommentSocialStats>;
}
