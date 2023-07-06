import { $lists } from '@/features/list/_model';
import { useStore } from 'effector-react';
import { useParams } from 'react-router-dom';

export const useEarlierLoadedList = () => {
  const { id } = useParams();

  const lists = useStore($lists);
  const earlierLoadedList = lists?.items.find((list) => list.id === Number(id));

  return { earlierLoadedList };
};
