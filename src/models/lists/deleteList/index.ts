import {
  CreateListDTO,
  DeleteListDTO,
  listService,
} from '@/features/list/services/list.service';
import { List } from '@/shared/api/types/list.type';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';

export const deleteList = createEvent<DeleteListDTO>();
export const clearState = createEvent();

export const deleteListFx = createEffect<DeleteListDTO, { listId: number }>();
deleteListFx.use(({listId}) => listService.deleteList(listId));

export const $deleteListSuccess = createStore<boolean>(false);
$deleteListSuccess.on(deleteList, () => false);
$deleteListSuccess.on(deleteListFx.doneData, () => true);
$deleteListSuccess.on(clearState, () => false);

export const $deleteListState = combine({
  success: $deleteListSuccess,
  loading: deleteListFx.pending,
});

sample({
  clock: deleteList,
  target: deleteListFx,
});
