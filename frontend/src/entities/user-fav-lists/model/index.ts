import { logoutFx } from '@/features/auth/model/logout';
import { sample } from 'effector';
import { clearFavorites } from './events';

export * from './events';
export * from './favLists';
export * from './favListsMap';

sample({
  clock: logoutFx.doneData,
  source: clearFavorites,
});
