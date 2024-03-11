import { CommentWithInfo } from '../../../shared/types';

export class CommentNode {
  constructor(
    readonly comment: CommentWithInfo,
    readonly replies: { nodes: CommentNode[]; loadNextKey: string | null } | null,
    readonly level: number,
  ) {}
}
