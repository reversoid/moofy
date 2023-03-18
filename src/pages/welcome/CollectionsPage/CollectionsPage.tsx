import { useStore } from 'effector-react';
import { memo, useEffect, useState } from 'react';
import { $getListsLoading, $getMoreListsLoading, getLists, getMoreLists } from '@/features/list/get-lists';
import { $lists } from '@/features/list/_model';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import { List } from '@/entities/List';
import { CreateListModal } from '@/features/list/create-list';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';

const CollectionsPage = () => {
  useEffect(getLists, []);
  const [createListModal, setCreateListModal] = useState(false);

  const { items, nextKey } = useStore($lists);
  const listsLoading = useStore($getListsLoading);
  const moreListsLoading = useStore($getMoreListsLoading);

  useLoadingBar(listsLoading, moreListsLoading)

  return (
    <>
      <ListGrid
        items={items}
        canLoadMore={Boolean(nextKey)}
        loadMore={
          nextKey ? () => getMoreLists({ lowerBound: nextKey }) : undefined
        }
        loadingMore={moreListsLoading}
        firstItem={
          <List
            onClick={() => setCreateListModal(true)}
            text="Создать коллекцию"
          />
        }
      />
      <CreateListModal
        isOpen={createListModal}
        setIsOpen={setCreateListModal}
      />
    </>
  );
};

export default memo(CollectionsPage);
