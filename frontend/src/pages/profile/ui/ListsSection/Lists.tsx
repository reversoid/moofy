import { FC, useState } from 'react';
import { useProfileLists } from '../../utils/useProfileLists';
import { useProfileFavLists } from '../../utils/useProfileFavLists';
import { Profile } from '@/shared/api/types/profile.type';
import { useListsRefetch } from '../../utils/useListsRefetch';
import { Text } from '@nextui-org/react';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import { PageTabs } from './ListsSection';
import { CreateListItem, CreateListModal } from '@/features/list/create-list';
import { useAuth } from '@/app';
import { useCollectionsPage } from '@/pages/welcome/CollectionsPage/utils/useCollectionsPage';

const NoCollections = () => {
  return (
    <Text size="$lg" color="$neutral">
      Нет коллекций
    </Text>
  );
};

const NoFavCollections = () => {
  return (
    <Text size="$lg" color="$neutral">
      Нет избранных коллекций
    </Text>
  );
};

interface ListsProps {
  tab: PageTabs;
  profile: Profile;
}

export const Lists: FC<ListsProps> = ({ profile, tab }) => {
  const [createListModal, setCreateListModal] = useState(false);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCollectionsPage();
  const lists = useProfileLists(profile);
  const favLists = useProfileFavLists(profile);

  useListsRefetch(tab, PageTabs.collections, lists.refetch);
  useListsRefetch(tab, PageTabs.favorites, favLists.refetch);

  const { userId, isLoggedIn } = useAuth();
  const userIsOwner = userId === Number(profile.id);

  if (tab === PageTabs.collections) {
    if (lists.result.length === 0) {
      return <NoCollections />;
    }

    if (userIsOwner && isLoggedIn) {
      return (
        <>
          <ListGrid
            items={data.map((i) => i.list)}
            loadMore={fetchNextPage}
            loadingMore={isFetchingNextPage}
            canLoadMore={hasNextPage}
            firstItem={
              <CreateListItem onClick={() => setCreateListModal(true)} />
            }
          />
          <CreateListModal
            isOpen={createListModal}
            setIsOpen={setCreateListModal}
          />
        </>
      );
    }

    return (
      <ListGrid
        items={lists.result}
        loadMore={lists.loadNextPage}
        loadingMore={lists.isLoadingMore}
        canLoadMore={lists.hasNextPage}
      />
    );
  }

  if (tab === PageTabs.favorites) {
    if (favLists.result.length === 0) {
      return <NoFavCollections />;
    }

    return (
      <ListGrid
        items={favLists.result.map((f) => f.list)}
        loadMore={() => favLists.loadNextPage}
        loadingMore={favLists.isLoadingMore}
        canLoadMore={favLists.hasNextPage}
      />
    );
  }

  return null;
};
