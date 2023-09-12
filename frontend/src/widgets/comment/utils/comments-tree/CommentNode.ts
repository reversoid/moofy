import { Comment, CommentInfo } from '@/shared/api/types/comment.type';
import { colorHash } from '@/shared/utils/colorHash';

export interface CommentWithInfo {
  comment: Comment;
  info: CommentInfo;
}

/** Single node of comments tree */
export class CommentNode {
  constructor(
    /** Nullable **only** for root element */
    public commentWithInfo: CommentWithInfo | null,
    replies: CommentWithInfo[] | null,
    public hexColor: string | null = null,
    public loadNextKey: string | null = null,
  ) {
    this.replies = replies?.map((r) => new CommentNode(r, null)) ?? null;
  }

  replies: CommentNode[] | null = null;

  public setLoadNextKey(loadNextKey: string | null) {
    this.loadNextKey = loadNextKey;
  }

  public addReplies(replies: CommentWithInfo[]) {
    const isReplyToReply =
      this.commentWithInfo !== null &&
      this.commentWithInfo.comment.reply_to !== null;

    this.hexColor = isReplyToReply
      ? colorHash.hex(String(this.commentWithInfo!.comment.id))
      : null;

    const nodes = replies.map((r) => new CommentNode(r, null, this.hexColor));

    if (this.replies) {
      this.replies.push(...nodes);
    } else {
      this.replies = nodes;
    }
  }

  public removeReplies() {
    this.loadNextKey = null;
    this.replies = null;
    this.hexColor = null;
  }
}
