import { ListWithAdditionalInfo } from '@/shared/api/types/list.type';
import LoadMore from '@/shared/components/LoadMore';
import { Stack } from '@/shared/ui/Stack';
import { FC } from 'react';
import { getGroupListsByDateText } from './utils/get-group-lists-by-date-text';
import { Group } from './ui/Group';
import { LargerStack } from './ui/LargerStack';

export interface CollectionsUpdatesListProps {
  data?: ListWithAdditionalInfo[];
  canLoadMore?: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
}

export const CollectionsUpdatesList: FC<CollectionsUpdatesListProps> = ({
  canLoadMore,
  isLoadingMore,
  data,
  loadMore,
}) => {
  const groups = getGroupListsByDateText(data ?? []);

  return (
    <>
      <LargerStack>
        {groups.map((g) => (
          <Group group={g} key={g.dateText} />
        ))}
      </LargerStack>

      {canLoadMore && <LoadMore loadMore={loadMore} loading={isLoadingMore} />}
    </>
  );
};

export default CollectionsUpdatesList;
