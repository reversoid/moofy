import { Comment, CommentInfo } from '@/shared/api/types/comment.type';
import { colorHash } from '@/shared/utils/colorHash';
import { CommentColor } from './CommentColor';

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
    public hexColor: CommentColor = new CommentColor(),
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

    if (isReplyToReply) {
      this.hexColor.setColor(
        colorHash.hex(String(this.commentWithInfo!.comment.id)),
      );
    }

    const nodes = replies.map(
      (r) => new CommentNode(r, null, this.hexColor.copy()),
    );

    if (this.replies) {
      this.replies.push(...nodes);
    } else {
      this.replies = nodes;
    }
  }

  public addNewComment(comment: Comment) {
    const commentWithInfo: CommentWithInfo = {
      comment,
      info: { isLiked: false, likesAmount: 0, repliesAmount: 0 },
    };

    const newNode = new CommentNode(
      commentWithInfo,
      null,
      this.hexColor.copy(),
    );

    if (this.replies) {
      this.replies.unshift(newNode);
    } else {
      this.replies = [newNode];
    }
    if (this.commentWithInfo) {
      this.commentWithInfo.info.repliesAmount++;
    }
  }

  public like() {
    if (this.commentWithInfo) {
      this.commentWithInfo.info.isLiked = true;
      this.commentWithInfo.info.likesAmount++;
    }
  }

  public unlike() {
    if (this.commentWithInfo) {
      this.commentWithInfo.info.isLiked = false;
      this.commentWithInfo.info.likesAmount--;
    }
  }

  public clearColor() {
    this.hexColor.clearColor();
  }

  public removeReplies() {
    this.loadNextKey = null;
    this.replies = null;
    this.hexColor.clearColor();
  }
}
