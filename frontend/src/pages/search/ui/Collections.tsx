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
    return (
      <Stack>
        <Text as={'p'} color="$neutral">
          Коллекций не найдено
        </Text>
      </Stack>
    );
  }

  return (
    <Stack>
      {collections?.map((list) => (
        <SearchListItem list={list} key={list.id} />
      ))}
    </Stack>
  );
};
