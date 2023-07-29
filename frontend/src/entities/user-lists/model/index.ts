import { unAuthorize } from '@/app';
import { clearUserLists } from './events';
import { sample } from 'effector';

export * from './userLists';
export * from './events';

sample({
  clock: unAuthorize,
  target: clearUserLists,
});
