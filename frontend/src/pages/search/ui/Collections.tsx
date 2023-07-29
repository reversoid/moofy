import { List } from '@/shared/api/types/list.type';
import { FC } from 'react';
import { Stack } from './Stack';
import { SearchListItem } from './SearchListItem';
import { Text } from '@nextui-org/react';

export interface CollectionsProps {
  collections?: List[];
  loading: boolean;
}

export const Collections: FC<CollectionsProps> = ({ collections, loading }) => {
  if (!loading && collections?.length === 0) {
    return <Text as={'p'} color='$neutral'>Коллекций не найдено</Text>
  }

  return (
    <Stack>
      {collections?.map((list) => (
        <SearchListItem list={list} key={list.id} />
      ))}
    </Stack>
  );
};
