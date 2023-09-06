import { createEvent } from 'effector';

/** This event is emitted when comment is liked */
export const commentLiked = createEvent<{
  listId: number;
  commentId: number;
}>();

/** This event is emitted when comment is unliked */
export const commentUnliked = createEvent<{
  listId: number;
  commentId: number;
}>();
