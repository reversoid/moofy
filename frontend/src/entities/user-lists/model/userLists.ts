import { List } from '@/shared/api/types/list.type';
import { createStore } from 'effector';
import {
  addList,
  clearUserLists,
  removeList,
  setUserLists,
  updateList,
} from './events';

/** Provides user lists on welcome page */
export const $userLists = createStore<List[]>([]);

$userLists.on(clearUserLists, () => []);

$userLists.on(addList, (state, payload) => [payload, ...state]);

$userLists.on(updateList, (state, payload) => {
  const newState = [...state];

  const index = newState.findIndex((l) => l.id === payload.id);
  if (index === -1) {
    return newState;
  }

  newState.splice(index, 1);

  return [payload, ...newState];
});

$userLists.on(removeList, (state, payload) =>
  state.filter((l) => l.id !== payload.id),
);

$userLists.on(setUserLists, (state, payload) => payload);
