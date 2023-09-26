import { CreateListItem, CreateListModal } from '@/features/list/create-list';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import { useState } from 'react';
import { useCollectionsPage } from './utils/useCollectionsPage';

const CollectionsPage = () => {
  const [createListModal, setCreateListModal] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCollectionsPage();

  useLoadingBar(isLoading);

  return (
    <>
      <ListGrid
        items={data.map(i => i.list)}
        canLoadMore={hasNextPage}
        loadMore={fetchNextPage}
        loadingMore={isFetchingNextPage}
        firstItem={<CreateListItem onClick={() => setCreateListModal(true)} />}
      />
      <CreateListModal
        isOpen={createListModal}
        setIsOpen={setCreateListModal}
      />
    </>
  );
};

export default CollectionsPage;
