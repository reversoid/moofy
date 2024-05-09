import { Comment, CommentWithInfo, PaginatedData } from '../../../../shared/types';
import { CommentNode } from './comment-node';

type CommentsProps = {
  comments: PaginatedData<CommentWithInfo>;
  rootNode?: never;
};

type TreeProps = {
  comments?: never;
  rootNode?: CommentNode;
};

type CommentsTreeProps = CommentsProps | TreeProps;

/** Tree structure of comments */
export class CommentsTree {
  constructor(props: CommentsTreeProps) {
    if (props.comments) {
      const { items: comments, nextKey } = props.comments;
      this.tree = new CommentNode({
        commentWithInfo: null,
        loadNextKey: nextKey,
        replies: comments,
      });
    } else if (props.rootNode) {
      this.tree = props.rootNode;
    }

    throw new Error('Comments or root node must be passed into constructor');
  }

  public tree: CommentNode;

  public copy(): CommentsTree {
    return new CommentsTree({ rootNode: this.tree });
  }

  public addReplies(
    replyToId: Comment['id'],
    replies: CommentWithInfo[],
    loadNextKey: string | null,
  ): void {
    const node = this.getNodeByCommentId(replyToId);
    node?.addReplies(replies);
    node?.setLoadNextKey(loadNextKey);
  }

  public addComment(comment: Comment) {
    const replyToId = comment.replyToId;
    if (!replyToId) {
      this.tree.addNewComment(comment);
      return;
    }

    const node = this.getNodeByCommentId(replyToId);

    node?.addNewComment(comment);
  }

  public likeComment(commentId: number): void {
    this.getNodeByCommentId(commentId)?.like();
  }

  public unlikeComment(commentId: number): void {
    this.getNodeByCommentId(commentId)?.unlike();
  }

  public removeReplies(replyToCommentId: number): void {
    this.getNodeByCommentId(replyToCommentId)?.removeReplies();
  }

  private getNodeByCommentId(commentId: number): CommentNode | null {
    if (!this.tree) {
      return null;
    }

    return this._getNodeByCommentId(this.tree, commentId);
  }

  private _getNodeByCommentId = (node: CommentNode, commentId: number): CommentNode | null => {
    if (node.commentWithInfo && node.commentWithInfo.comment.id === commentId) {
      return node;
    }

    if (node.replies) {
      for (const replyNode of node.replies) {
        const foundNode = this._getNodeByCommentId(replyNode, commentId);
        if (foundNode) {
          return foundNode;
        }
      }
    }

    return null;
  };
}
