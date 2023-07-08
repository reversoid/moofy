import { $lists } from '@/features/list/_model';
import { useStore } from 'effector-react';

export const useEarlierLoadedList = (id: Number) => {
  const lists = useStore($lists);
  const earlierLoadedList = lists?.find((list) => list.id === id);

  return { earlierLoadedList };
};
