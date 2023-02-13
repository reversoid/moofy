import { listService } from '@/features/list/services/list.service';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { updateListFx } from '../updateList';
import { IterableResponse } from '@/shared/api/types/shared';
import { Review } from '@/shared/api/types/review.type';
import { List } from '@/shared/api/types/list.type';
import { loadMoreFx } from './loadMore';

export const getList = createEvent<number>();

export const getListFx = createEffect<
  number,
  { reviews: IterableResponse<Review>; list: List }
>();
getListFx.use((id) => listService.getMyListWithContent(id));

export const $list = createStore<{
  reviews: IterableResponse<Review>;
  list: List;
} | null>(null);
$list.on(getListFx.doneData, (state, payload) => payload);
$list.on(updateListFx.doneData, (state, payload) => {
  if (!state) {
    return state;
  }
  return { ...state, list: payload };
});
$list.on(getList, () => null);
$list.on(loadMoreFx.doneData, (state, payload) => {
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

export const $listError = createStore<string | null>(null);
$listError.on(
  getListFx.failData,
  (state, payload) => (payload.cause as any)?.message ?? null,
);
$listError.on(getList, () => null);

export const $listState = combine({
  list: $list,
  error: $listError,
  loading: getListFx.pending,
});

sample({
  clock: getList,
  target: getListFx,
});
