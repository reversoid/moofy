import { CommentNode } from './comment-node';
import { CommentWithInfo } from '../../../shared/types';

export class CommentsTree {
  commentNodes: CommentNode[];

  constructor(comments: CommentWithInfo[]) {
    this.commentNodes = this.getInitialCommentNodes(comments);
  }

  private getInitialCommentNodes(comments: CommentWithInfo[]): CommentNode[] {
    return [];
  }
}
