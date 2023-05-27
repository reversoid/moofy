import { List } from '@/shared/api/types/list.type';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { UpdateListDTO, listService } from '../../_api/list.service';

export const updateList = createEvent<UpdateListDTO>();
export const clearState = createEvent();

export const updateListFx = createEffect<UpdateListDTO, List>();
updateListFx.use((dto) => listService.updateList(dto));

const $updateListSuccess = createStore<boolean>(false);
$updateListSuccess.on(updateList, () => false);
$updateListSuccess.on(updateListFx.doneData, () => true);
$updateListSuccess.on(clearState, () => false);

export const $updateListState = combine({
  success: $updateListSuccess,
  loading: updateListFx.pending,
});

sample({
  clock: updateList,
  target: updateListFx,
});
