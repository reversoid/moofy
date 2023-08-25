import { List } from '@/shared/api/types/list.type';
import { createEvent, sample } from 'effector';
import { updateList as updateUserList } from '@/entities/user-lists';

/** This event is emitted when the list is updated */
export const updateList = createEvent<{ list: List }>();

sample({
  clock: updateList,
  fn(data) {
    return data.list;
  },

  target: updateUserList,
});
