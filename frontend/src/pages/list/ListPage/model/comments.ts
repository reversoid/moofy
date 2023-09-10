import { createEvent, createStore } from 'effector';
import { CommentsTree } from '../utils/comments-tree/CommentsTree';
import { CommentWithInfo } from '../utils/comments-tree/CommentNode';

export const $comments = createStore<CommentsTree | null>(null);

const setupComments = createEvent<{ listId: number; comments: CommentWithInfo[] }>();

const addReplies = createEvent<{
  commentId: number;
  comments: CommentWithInfo[];
  nextKey: string | null;
}>();

const removeReplies = createEvent<{
  commentId: number;
}>();

$comments.on(setupComments, (state, payload) => {
  return new CommentsTree(payload.listId, payload.comments);
});

$comments.on(addReplies, (state, payload) => {
  if (!state) {
    return state;
  }
  state.addReplies(payload.commentId, payload.comments, payload.nextKey);
  return state;
});

$comments.on(removeReplies, (state, payload) => {
  if (!state) {
    return state;
  }
  state.removeReplies(payload.commentId);
  return state;
});
