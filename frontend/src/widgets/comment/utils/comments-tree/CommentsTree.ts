import { CommentNode, CommentWithInfo } from './CommentNode';

interface Comments {
  comments: CommentWithInfo[];
  loadNextKey: string | null;
}

/** Tree structure of comments */
export class CommentsTree {
  constructor(public listId: number, commentsOrTree: Comments | CommentNode) {
    if (commentsOrTree instanceof CommentNode) {
      this.tree = commentsOrTree;
      return;
    }
    const { comments, loadNextKey } = commentsOrTree;
    this.tree = new CommentNode(null, comments, undefined, loadNextKey);
  }

  public tree: CommentNode;

  public copy(): CommentsTree {
    return new CommentsTree(this.listId, this.tree);
  }

  public addReplies(
    replyToCommentId: number,
    replies: CommentWithInfo[],
    loadNextKey: string | null,
  ): void {
    const node = this.getNodeByCommentId(replyToCommentId);
    node?.addReplies(replies);
    node?.setLoadNextKey(loadNextKey);
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

  private _getNodeByCommentId = (
    node: CommentNode,
    commentId: number,
  ): CommentNode | null => {
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
