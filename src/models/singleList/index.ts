import {
  IterableResponse,
  List,
  Review,
  listService,
} from '@/features/list/services/list.service';
import { combine, createEffect, createEvent, createStore, sample } from 'effector';

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

export const $listError = createStore<string | null>(null);
$listError.on(getListFx.failData, (state, payload) => (payload.cause as any)?.message ?? null);
$listError.on(getList, () => null)

export const $listState = combine({
  list: $list,
  error: $listError,
  loading: getListFx.pending,
})

sample({
  clock: getList,
  target: getListFx,
});
