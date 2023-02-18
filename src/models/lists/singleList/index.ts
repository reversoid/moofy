import { listService } from '@/features/list/services/list.service';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  restore,
  sample,
} from 'effector';
import { updateListFx } from '../updateList';
import { IterableResponse } from '@/shared/api/types/shared';
import { Review } from '@/shared/api/types/review.type';
import { List } from '@/shared/api/types/list.type';
import { loadMoreReviewsFx } from './loadMoreReviews';
import { updateReviewFx } from '@/models/reviews/updateReview';
import { deleteReview, deleteReviewFx } from '@/models/reviews/deleteReview';
import { deleteReviewById, updateReviewInList } from './utils';

export type ListStore = {
  reviews: IterableResponse<Review>;
  list: List;
} | null;

export const getList = createEvent<number>();

export const getListFx = createEffect<
  number,
  { reviews: IterableResponse<Review>; list: List }
>();
getListFx.use((id) => listService.getMyListWithContent(id));

export const $list = createStore<ListStore>(null);
$list.on(getListFx.doneData, (state, payload) => payload);
$list.on(updateListFx.doneData, (state, payload) => {
  if (!state) {
    return state;
  }
  return { ...state, list: payload };
});

$list.on(loadMoreReviewsFx.doneData, (state, payload) => {
  if (!state) {
    return state;
  }
  return {
    ...state,
    reviews: {
      nextKey: payload.nextKey,
      items: [...state.reviews.items, ...payload.items],
    },
  };
});

$list.on(updateReviewFx.doneData, (state, payload) => {
  if (!state) {
    return state;
  }

  return {
    ...state,
    reviews: {
      nextKey: state.reviews.nextKey,
      items: updateReviewInList(state.reviews.items, payload),
    },
  };
});

$list.on(deleteReviewFx.doneData, (state, payload) => {
  if (!state) {
    return;
  }
  return {
    ...state,
    reviews: {
      nextKey: state.reviews.nextKey,
      items: deleteReviewById(state.reviews.items, payload.reviewId),
    },
  };
});

export const $listError = createStore<string | null>(null);
$listError.on(
  getListFx.failData,
  (state, payload) => (payload.cause as any)?.message ?? null,
);
$listError.on(getList, () => null);

export const $listLoading = createStore<boolean>(false)
$listLoading.on(getList, () => true)
$listLoading.on(getListFx.finally, () => false)
$listLoading.on(deleteReview, () => true)
$listLoading.on(deleteReviewFx.finally, () => false)

export const $listState = combine({
  list: $list,
  error: $listError,
  loading: $listLoading,
});

sample({
  clock: getList,
  target: getListFx,
});
