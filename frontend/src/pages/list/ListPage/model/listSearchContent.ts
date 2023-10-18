import { createEvent, createStore } from 'effector';
import { Review } from '@/shared/api/types/review.type';

export const setSearchList = createEvent<{
  listId: number;
  reviews: Review[];
}>();
export const deleteSearchItem = createEvent<{
  listId: number;
  reviewId: number;
}>();

export const $_searchStore = createStore<{ [key: string]: Review[] }>({});

$_searchStore.on(setSearchList, (state, { listId, reviews }) => ({
  ...state,
  [listId]: reviews,
}));

$_searchStore.on(deleteSearchItem, (state, { listId, reviewId }) => ({
  ...Object.fromEntries(
    Object.entries(state).map(([key, value]) => [
      key,
      value.filter((l) => l.id !== reviewId),
    ]),
  ),
}));
