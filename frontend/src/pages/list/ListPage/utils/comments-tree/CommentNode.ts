import { Comment } from '@/shared/api/types/comment.type';

/** Single node of comments tree */
export class CommentNode {
  constructor(comment: Comment | null, replies: Comment[] | null) {
    this.comment = comment;
    this.replies = replies?.map((r) => new CommentNode(r, null)) ?? null;
  }

  comment: Comment | null = null;
  replies: CommentNode[] | null = null;

  public addReplies(replies: Comment[]) {
    const nodes = replies.map((r) => new CommentNode(r, null));

    if (this.replies) {
      this.replies.push(...nodes);
    } else {
      this.replies = nodes;
    }
  }

  public removeReplies() {
    this.replies = null;
  }
}
