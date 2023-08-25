import { FC } from 'react';
import { useProfileLists } from '../../utils/useProfileLists';
import { useProfileFavLists } from '../../utils/useProfileFavLists';
import { Profile } from '@/shared/api/types/profile.type';
import { useListsRefetch } from '../../utils/useListsRefetch';
import { Text } from '@nextui-org/react';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import { PageTabs } from './ListsSection';

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
  const lists = useProfileLists(profile);
  const favLists = useProfileFavLists(profile);
  
  useListsRefetch(tab, PageTabs.collections, lists.refetch);
  useListsRefetch(tab, PageTabs.favorites, favLists.refetch);

  if (tab === PageTabs.collections) {
    if (lists.result.length === 0) {
      return <NoCollections />;
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
