import { ListWithAdditionalInfo } from '@/shared/api/types/list.type';
import LoadMore from '@/shared/components/LoadMore';
import { Stack } from '@/shared/ui/Stack';
import { FC } from 'react';
import { getGroupListsByDateText } from './utils/get-group-lists-by-date-text';
import { Group } from './ui/Group';
import { LargerStack } from './ui/LargerStack';
import { Text } from '@nextui-org/react';

export interface CollectionsUpdatesListProps {
  data?: ListWithAdditionalInfo[];
  canLoadMore?: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  loading: boolean;
}

export const CollectionsUpdatesList: FC<CollectionsUpdatesListProps> = ({
  canLoadMore,
  isLoadingMore,
  data,
  loadMore,
  loading,
}) => {
  const groups = getGroupListsByDateText(data ?? []);
  const showEmptyPlaceholder = !loading && data?.length === 0;

  return (
    <>
      <LargerStack>
        {groups.map((g) => (
          <Group group={g} key={g.dateText} />
        ))}
      </LargerStack>

      {showEmptyPlaceholder && (
        <Text size={'$lg'} color="$neutral">
          Нет обновлений от ваших подписок
        </Text>
      )}

      {canLoadMore && <LoadMore loadMore={loadMore} loading={isLoadingMore} />}
    </>
  );
};

export default CollectionsUpdatesList;
