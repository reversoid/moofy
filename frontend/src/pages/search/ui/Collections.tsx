import { List } from '@/shared/api/types/list.type';
import { FC } from 'react';
import { RowListItem } from '../../../entities/row-list-item/ui/RowListItem';
import { Text } from '@nextui-org/react';
import { Stack } from '@/shared/ui/Stack';

export interface CollectionsProps {
  collections?: List[];
  loading: boolean;
}

export const Collections: FC<CollectionsProps> = ({ collections, loading }) => {
  if (!loading && collections?.length === 0) {
    return (
      <Stack css={{ mt: '$12' }}>
        <Text as={'p'} color="$neutral">
          Коллекций не найдено
        </Text>
      </Stack>
    );
  }

  return (
    <Stack css={{ mt: '$12' }}>
      {collections?.map((list) => (
        <RowListItem list={list} key={list.id} />
      ))}
    </Stack>
  );
};
