import CreateListModal from '@/features/list/components/CreateListModal/CreateListModal';
import List from '@/features/list/components/List/List';
import { $listsState, getLists } from '@/models/lists';
import { loadMoreLists, loadMoreListsFx } from '@/models/lists/loadMoreLists';
import { Button, Loading } from '@nextui-org/react';
import { useStore } from 'effector-react';
import { memo, useEffect, useState } from 'react';
import { LoadMoreContainer } from '../Layout';
import ListGrid from '@/features/list/components/ListGrid/ListGrid';

const CollectionsPage = () => {
  useEffect(getLists, []);
  const { lists } = useStore($listsState);
  const [isCreateListModalOpen, setCreateListModalOpen] = useState(false);

  const loadMoreLoading = useStore(loadMoreListsFx.pending);

  const handleLoadMore = () => {
    if (loadMoreLoading || !lists.nextKey) {
      return;
    }
    loadMoreLists({ lowerBound: lists.nextKey });
  };

  return (
    <>
      <ListGrid
        items={lists.items}
        firstItem={
          <List onClick={() => setCreateListModalOpen(true)} text="Создать коллекцию" />
        }
      />

      {lists.nextKey && (
        <LoadMoreContainer>
          <Button color="gradient" onPress={handleLoadMore}>
            {loadMoreLoading ? (
              <Loading type="points" color="white" />
            ) : (
              'Загрузить больше'
            )}
          </Button>
        </LoadMoreContainer>
      )}
      <CreateListModal isOpen={isCreateListModalOpen} setIsOpen={setCreateListModalOpen} />
    </>
  );
};

export default memo(CollectionsPage);
