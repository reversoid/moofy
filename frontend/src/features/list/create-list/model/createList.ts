import { List } from '@/shared/api/types/list.type';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { CreateListDTO, listService } from '../../_api/list.service';

export const createList = createEvent<CreateListDTO>();
export const clearState = createEvent();

export const createListFx = createEffect<CreateListDTO, List>();
createListFx.use((dto) => listService.createList(dto));

const $createListSuccess = createStore<boolean>(false);
$createListSuccess.on(createList, () => false);
$createListSuccess.on(createListFx.doneData, () => true);
$createListSuccess.on(clearState, () => false);

export const $createListState = combine({
  success: $createListSuccess,
  loading: createListFx.pending,
});

sample({
  clock: createList,
  target: createListFx,
});
