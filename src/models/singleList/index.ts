import {
  IterableResponse,
  List,
  Review,
  listService,
} from '@/features/list/services/list.service';
import { createEffect, createEvent, createStore, sample } from 'effector';

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

sample({
  clock: getList,
  target: getListFx,
});
