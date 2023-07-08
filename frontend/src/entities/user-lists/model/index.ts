import { logoutFx } from '@/features/auth/model/logout';
import { clearUserLists } from './events';
import { sample } from 'effector';

export * from './userLists';
export * from './events';

sample({
  clock: logoutFx.doneData,
  source: clearUserLists,
});
