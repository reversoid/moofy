import { createEvent, sample } from 'effector';
import { DeleteListDTO } from '../../api/list.service';
import { removeList } from '@/entities/user-lists';

/** This event is emitted when the list is deleted */
export const deleteList = createEvent<DeleteListDTO>();

sample({
  clock: deleteList,
  fn(clk) {
    return { id: clk.listId };
  },
  target: removeList,
});
