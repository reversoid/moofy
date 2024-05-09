import { Comment, CommentWithInfo } from '../../../../shared/types';

interface CommentNodeProps {
  commentWithInfo: CommentWithInfo | null;
  replies: CommentWithInfo[] | null;
  loadNextKey: string | null;
}

/** Single node of comments tree */
export class CommentNode {
  replies: CommentNode[] | null = null;

  loadNextKey: string | null = null;

  commentWithInfo: CommentWithInfo | null = null;

  constructor({ commentWithInfo, loadNextKey, replies }: CommentNodeProps) {
    this.loadNextKey = loadNextKey;
    this.commentWithInfo = commentWithInfo;
    this.replies =
      replies?.map(
        (reply) => new CommentNode({ commentWithInfo: reply, loadNextKey: null, replies: null }),
      ) ?? null;
  }

  public setLoadNextKey(loadNextKey: string | null) {
    this.loadNextKey = loadNextKey;
  }

  public addReplies(replies: CommentWithInfo[]) {
    const nodes = replies.map(
      (reply) => new CommentNode({ commentWithInfo: reply, loadNextKey: null, replies: null }),
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
      additionalInfo: { isLiked: false },
      socialStats: { likesAmount: 0, repliesAmount: 0 },
    };

    const newNode = new CommentNode({ commentWithInfo, loadNextKey: null, replies: null });

    if (this.replies) {
      this.replies.unshift(newNode);
    } else {
      this.replies = [newNode];
    }
    if (this.commentWithInfo) {
      this.commentWithInfo.socialStats.repliesAmount++;
    }
  }

  public like() {
    if (this.commentWithInfo) {
      this.commentWithInfo.additionalInfo.isLiked = true;
      this.commentWithInfo.socialStats.likesAmount++;
    }
  }

  public unlike() {
    if (this.commentWithInfo) {
      this.commentWithInfo.additionalInfo.isLiked = false;
      this.commentWithInfo.socialStats.likesAmount--;
    }
  }

  public removeReplies() {
    this.loadNextKey = null;
    this.replies = null;
  }
}
