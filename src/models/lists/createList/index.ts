import {
  CreateListDTO,
  List,
  listService,
} from '@/features/list/services/list.service';
import { createEffect, createEvent, createStore, sample } from 'effector';

export const createList = createEvent<CreateListDTO>();
export const removeSuccessStatus = createEvent();

export const createListFx = createEffect<CreateListDTO, List>();
createListFx.use((dto) => listService.createList(dto));

export const $createListSuccess = createStore<boolean>(false);
$createListSuccess.on(createList, () => false)
$createListSuccess.on(createListFx.doneData, () => true)
$createListSuccess.on(removeSuccessStatus, () => false)

sample({
  clock: createList,
  target: createListFx,
});
