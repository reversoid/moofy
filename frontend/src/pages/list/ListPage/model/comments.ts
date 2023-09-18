import { createEvent, createStore } from 'effector';
import { CommentsTree } from '../../../../widgets/comment/utils/comments-tree/CommentsTree';
import { CommentWithInfo } from '../../../../widgets/comment/utils/comments-tree/CommentNode';

export const $comments = createStore<CommentsTree | null>(null);

export const setupComments = createEvent<{
  listId: number;
  comments: CommentWithInfo[];
  nextKey: string | null;
}>();

export const addReplies = createEvent<{
  commentId: number;
  comments: CommentWithInfo[];
  nextKey: string | null;
}>();

export const removeReplies = createEvent<{
  commentId: number;
}>();

$comments.on(setupComments, (state, { comments, listId, nextKey }) => {
  return new CommentsTree(listId, {
    comments,
    loadNextKey: nextKey,
  });
});

$comments.on(addReplies, (state, payload) => {
  if (!state) {
    return state;
  }  

  state.addReplies(payload.commentId, payload.comments, payload.nextKey);
  return state.copy();
});

$comments.on(removeReplies, (state, payload) => {
  if (!state) {
    return state;
  }
  state.removeReplies(payload.commentId);

  return state.copy();
});
