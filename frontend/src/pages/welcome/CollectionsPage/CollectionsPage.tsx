import { List } from '@/entities/List';
import { CreateListModal } from '@/features/list/create-list';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import { useState } from 'react';
import { useCollectionsPage } from './lib/useCollectionsPage';

const CollectionsPage = () => {
  const [createListModal, setCreateListModal] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCollectionsPage();

  useLoadingBar(isLoading);

  return (
    <>
      <ListGrid
        items={data}
        canLoadMore={hasNextPage}
        loadMore={fetchNextPage}
        loadingMore={isFetchingNextPage}
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

export default CollectionsPage;
