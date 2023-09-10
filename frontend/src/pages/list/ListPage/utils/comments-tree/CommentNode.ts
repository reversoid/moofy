import { Comment } from '@/shared/api/types/comment.type';

/** Single node of comments tree */
export class CommentNode {
  constructor(
    public comment: Comment | null,
    replies: Comment[] | null,
    public isColored: boolean = false,
    public loadNextKey: string | null = null,
  ) {
    this.replies = replies?.map((r) => new CommentNode(r, null)) ?? null;
  }

  replies: CommentNode[] | null = null;

  public addReplies(replies: Comment[], loadNextKey: string | null) {
    this.loadNextKey = loadNextKey;

    const isReplyToReply =
      this.comment !== null && this.comment.reply_to !== undefined;

    this.isColored = isReplyToReply;

    const nodes = replies.map((r) => new CommentNode(r, null, isReplyToReply));

    if (this.replies) {
      this.replies.push(...nodes);
    } else {
      this.replies = nodes;
    }
  }

  public removeReplies() {
    this.loadNextKey = null;
    this.replies = null;
    this.isColored = false;
  }
}
