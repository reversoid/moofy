import { createEvent, createStore } from 'effector';
import { CommentsTree } from '../utils/comments-tree/CommentsTree';
import { Comment } from '@/shared/api/types/comment.type';

export const $comments = createStore<CommentsTree | null>(null);

const setupComments = createEvent<{ listId: number; comments: Comment[] }>();

const addReplies = createEvent<{
  commentId: number;
  comments: Comment[];
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
