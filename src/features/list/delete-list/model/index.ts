import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { DeleteListDTO, listService } from '../../_api/list.service';

export const deleteList = createEvent<DeleteListDTO>();
export const clearState = createEvent();

export const deleteListFx = createEffect<DeleteListDTO, { listId: number }>();
deleteListFx.use(({ listId }) => listService.deleteList(listId));

const $deleteListSuccess = createStore<boolean>(false);
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
