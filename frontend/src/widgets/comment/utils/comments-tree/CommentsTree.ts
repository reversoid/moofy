import { CommentNode, CommentWithInfo } from './CommentNode';

/** Tree structure of comments */
export class CommentsTree {
  constructor(public listId: number, comments: CommentWithInfo[], loadNextKey: string | null) {
    this._tree = new CommentNode(null, comments, false, loadNextKey);
  }

  private _tree: CommentNode;

  public addReplies(
    replyToCommentId: number,
    replies: CommentWithInfo[],
    loadNextKey: string | null,
  ): void {
    const node = this.getNodeByCommentId(replyToCommentId)
    node?.addReplies(replies);
    node?.setLoadNextKey(loadNextKey)
  }

  public removeReplies(replyToCommentId: number): void {
    this.getNodeByCommentId(replyToCommentId)?.removeReplies();
  }

  public toArray(): CommentNode[] {
    const result: CommentNode[] = [];
    this._dfs(this._tree, result);
    return result;
  }

  private _dfs(node: CommentNode | null, accumulator: CommentNode[]): void {
    if (!node || !node.commentWithInfo) {
      return;
    }

    accumulator.push(node);

    if (!node.replies) {
      return;
    }

    for (const replyNode of node.replies) {
      this._dfs(replyNode, accumulator);
    }
  }

  private getNodeByCommentId(commentId: number): CommentNode | null {
    if (!this._tree) {
      return null;
    }

    return this._getNodeByCommentId(this._tree, commentId);
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
