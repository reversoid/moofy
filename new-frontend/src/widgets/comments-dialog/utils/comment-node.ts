import { CommentWithInfo } from '../../../shared/types';

export class CommentNode {
  constructor(
    readonly comment: CommentWithInfo,
    readonly level: number,
  ) {}

  replies: { nodes: CommentNode[]; loadNextKey: string | null } | null = null;
}
