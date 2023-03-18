import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { listService } from '../../_api/list.service';
import { List } from '@/shared/api/types/list.type';
import { IterableResponse } from '@/shared/api/types/shared';
import { Review } from '@/shared/api/types/review.type';

export const getList = createEvent<number>();

export const getListFx = createEffect<
  number,
  {
    reviews: IterableResponse<Review>;
    list: List;
    additionalInfo: {
      isFavorite: boolean;
    };
  }
>();
getListFx.use((id) => listService.getMyListWithContent(id));

const $listError = createStore<string | null>(null);
$listError.on(
  getListFx.failData,
  (state, payload) => (payload.cause as any)?.message ?? null,
);
$listError.on(getList, () => null);

const $listLoading = getListFx.pending;

export const $getListState = combine({
  error: $listError,
  loading: $listLoading,
});

sample({
  clock: getList,
  target: getListFx,
});
