import {
  UpdateListDTO,
  List,
  listService,
} from '@/features/list/services/list.service';
import { combine, createEffect, createEvent, createStore, sample } from 'effector';

export const updateList = createEvent<UpdateListDTO>();
export const clearState = createEvent();

export const updateListFx = createEffect<UpdateListDTO, List>();
updateListFx.use((dto) => listService.updateList(dto));

export const $updateListSuccess = createStore<boolean>(false);
$updateListSuccess.on(updateList, () => false)
$updateListSuccess.on(updateListFx.doneData, () => true)
$updateListSuccess.on(clearState, () => false)

export const updateListState = combine({
  success: $updateListSuccess,
  loading: updateListFx.pending
})

sample({
  clock: updateList,
  target: updateListFx,
});
