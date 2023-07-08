import { $userFavLists } from '@/entities/user-fav-lists';
import { $userLists } from '@/entities/user-lists';
import { combine } from 'effector';
import { useStore } from 'effector-react';

const $lists = combine($userLists, $userFavLists).map(([lists, favs]) => [
  ...lists,
  ...favs.map((f) => f.list),
]);

export const useEarlierLoadedList = (id: Number) => {
  const lists = useStore($lists);

  const list = lists.find((list) => list.id === id);

  return { earlierLoadedList: list };
};
