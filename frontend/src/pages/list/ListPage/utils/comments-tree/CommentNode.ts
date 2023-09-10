import { Comment, CommentsStats } from '@/shared/api/types/comment.type';

export interface CommentWithInfo {
  comment: Comment;
  stats: CommentsStats;
}

/** Single node of comments tree */
export class CommentNode {
  constructor(
    public commentWithInfo: CommentWithInfo | null,
    replies: CommentWithInfo[] | null,
    public isColored: boolean = false,
    public loadNextKey: string | null = null,
  ) {
    this.replies = replies?.map((r) => new CommentNode(r, null)) ?? null;
  }

  replies: CommentNode[] | null = null;

  public addReplies(replies: CommentWithInfo[], loadNextKey: string | null) {
    this.loadNextKey = loadNextKey;

    const isReplyToReply =
      this.commentWithInfo !== null &&
      this.commentWithInfo.comment.reply_to !== undefined;

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
