import React, { FC, useEffect, useState } from 'react';
import { Profile } from '@/shared/api/types/profile.type';
import { useProfileLists } from '../lib/useProfileLists';
import { useProfileFavLists } from '../lib/useProfileFavLists';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import { Text } from '@nextui-org/react';
import Tabs from '@/shared/ui/Tabs/Tabs/Tabs';
import { TabProps } from '@/shared/ui/Tabs/Tabs/Tab';

export interface ListsSectionProps {
  profile: Profile;
  isOwner: boolean;
}

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

const ownerTabs = [{ label: 'Мои коллекции' }, { label: 'Избранное' }];
const userTabs = [{ label: 'Все коллекции' }];

interface ListsProps {
  tab: PageTabs;
  profile: Profile;
}

const useListsRefetch = (
  currentTab: PageTabs,
  tabToActOn: PageTabs,
  refetch: () => void,
) => {
  useEffect(() => {
    if (currentTab === tabToActOn) {
      refetch();
    }
  }, [currentTab]);
};

const Lists: FC<ListsProps> = ({ tab, profile }) => {
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

export enum PageTabs {
  collections,
  favorites,
}

export const ListsSection: FC<ListsSectionProps> = ({ profile, isOwner }) => {
  const tabs: TabProps[] = isOwner ? ownerTabs : userTabs;
  const [tab, setTab] = useState<PageTabs>(PageTabs.collections);

  return (
    <>
      <Tabs
        tabs={tabs}
        tabValue={tab}
        onChange={(newValue) => setTab(newValue)}
        css={{ mb: '0.75rem', pt: '1rem' }}
      />

      <Lists profile={profile} tab={tab} />
    </>
  );
};
