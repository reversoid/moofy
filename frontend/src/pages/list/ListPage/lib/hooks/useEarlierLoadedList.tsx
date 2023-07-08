import { $userLists } from '@/entities/user-lists';
import { useStore } from 'effector-react';

export const useEarlierLoadedList = (id: Number) => {
  const lists = useStore($userLists);
  const earlierLoadedList = lists?.find((list) => list.id === id);

  return { earlierLoadedList };
};
