import { createEvent } from 'effector';

/** This event is emitted when list is liked */
export const listLiked = createEvent<{
  listId: number;
}>();

/** This event is emitted when list is unliked */
export const listUnliked = createEvent<{
  listId: number;
}>();
