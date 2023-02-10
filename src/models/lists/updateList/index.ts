import {
  UpdateListDTO,
  List,
  listService,
} from '@/features/list/services/list.service';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const updateList = createEvent<UpdateListDTO>();
export const removeSuccessStatus = createEvent();

export const updateListFx = createEffect<UpdateListDTO, List>();
updateListFx.use((dto) => listService.updateList(dto));

export const $updateListSuccess = createStore<boolean>(false);
$updateListSuccess.on(updateList, () => false)
$updateListSuccess.on(updateListFx.doneData, () => true)
$updateListSuccess.on(removeSuccessStatus, () => false)

sample({
  clock: updateList,
  target: updateListFx,
});
