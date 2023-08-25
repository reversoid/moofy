import { unAuthorize } from '@/app';
import { sample } from 'effector';
import { clearFavorites } from './events';

export * from './events';
export * from './favLists';
export * from './favListsMap';

sample({
  clock: unAuthorize,
  target: [clearFavorites],
});
