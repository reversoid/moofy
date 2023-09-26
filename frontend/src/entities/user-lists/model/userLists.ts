import { ListWithAdditionalInfo } from '@/shared/api/types/list.type';
import { createStore } from 'effector';
import {
  addList,
  clearUserLists,
  removeList,
  setUserLists,
  updateList,
} from './events';

/** Provides user lists on welcome page */
export const $userLists = createStore<ListWithAdditionalInfo[]>([]);

$userLists.on(clearUserLists, () => []);

$userLists.on(addList, (state, payload) => [
  {
    list: payload,
    additionalInfo: {
      commentsAmount: 0,
      isFavorite: false,
      isLiked: false,
      isUpdatedSinceLastView: false,
      isViewed: true,
      likesAmount: 0,
    },
  },
  ...state,
]);

$userLists.on(updateList, (state, payload) => {
  const newState = [...state];

  const index = newState.findIndex((l) => l.list.id === payload.id);
  if (index === -1) {
    return newState;
  }

  const [updatedList] = newState.splice(index, 1);

  return [
    { list: payload, additionalInfo: updatedList.additionalInfo },
    ...newState,
  ];
});

$userLists.on(removeList, (state, payload) =>
  state.filter((l) => l.list.id !== payload.id),
);

$userLists.on(setUserLists, (state, payload) => payload);
