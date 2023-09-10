import { Comment } from '@/shared/api/types/comment.type';
import { CommentNode } from './CommentNode';

/** Contains comments in tree structure */
export class CommentsTree {
  constructor(public listId: number, comments: Comment[]) {
    this._tree = new CommentNode(null, comments);
  }

  private _tree: CommentNode;

  public addReplies(
    replyToCommentId: number,
    replies: Comment[],
    loadNextKey: string | null,
  ): void {
    this.getNodeByCommentId(replyToCommentId)?.addReplies(replies, loadNextKey);
  }

  public removeReplies(replyToCommentId: number): void {
    this.getNodeByCommentId(replyToCommentId)?.removeReplies();
  }

  public toArray(): Comment[] {
    const result: Comment[] = [];
    this._dfs(this._tree, result);
    return result;
  }

  private _dfs(node: CommentNode | null, accumulator: Comment[]): void {
    if (!node || !node.comment) {
      return;
    }

    accumulator.push(node.comment);

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
    if (node.comment && node.comment.id === commentId) {
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
