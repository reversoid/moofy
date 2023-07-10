import { logout } from '@/features/auth/model/logout';
import { Profile } from '@/shared/api/types/profile.type';
import { TabProps } from '@/shared/ui/Tabs/Tabs/Tab';
import Tabs from '@/shared/ui/Tabs/Tabs/Tabs';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import { Button, Text } from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';

import { listService } from '@/features/list/_api/list.service';
import { List } from '@/shared/api/types/list.type';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { transformInfiniteIterableData } from '@/shared/lib/reactQueryAddons/transformInfiniteData';
import { useCachedInfiniteData } from '@/shared/lib/reactQueryAddons/useCachedInfiniteData';
import { useNewInfiniteData } from '@/shared/lib/reactQueryAddons/useNewInfiniteData';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useStore } from 'effector-react';
import {
  $getMoreProfileFavListsLoading,
  getMoreProfileFavLists,
} from '../model/getMoreProfileFavLists';
import { $profileLists, setProfileLists } from '../model/profile';

interface PageContentProps {
  profile: Profile;
  userOwner: boolean;
}

const ownerTabs = [{ label: 'Мои коллекции' }, { label: 'Избранное' }];
const userTabs = [{ label: 'Все коллекции' }];

enum PageTabs {
  collections,
  favorites,
}

const useProfileLists = (profile: Profile) => {
  const lists = useStore($profileLists);

  const result = useInfiniteQuery<IterableResponse<List>, FetchError>({
    queryKey: ['Fetch more profile lists', profile.id],
    queryFn: ({ pageParam }) => listService.getUserLists(profile.id, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
    enabled: false,
    initialData: {
      pageParams: [],
      pages: [
        {
          items: profile.allLists.lists.items,
          nextKey: profile.allLists.lists.nextKey,
        },
      ],
    },
  });

  useCachedInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setProfileLists(content);
    }
  });

  useNewInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setProfileLists(content);
    }
  });

  return {
    lists: lists ?? [],
    hasNextPage: result.hasNextPage,
    loadNextPage: result.fetchNextPage,
    isLoadingMore: result.isFetchingNextPage,
  };
};

const PageContent: FC<PageContentProps> = ({ profile, userOwner }) => {
  const tabs: TabProps[] = userOwner ? ownerTabs : userTabs;

  const [tab, setTab] = useState<PageTabs>(PageTabs.collections);

  const { lists, hasNextPage, isLoadingMore, loadNextPage } =
    useProfileLists(profile);

  const moreFavListsLoading = useStore($getMoreProfileFavListsLoading);

  useEffect(() => {
    // TODO need it?
    if (tab === PageTabs.favorites) {
      // getProfileFavLists();
    } else if (tab === PageTabs.collections) {
      // getProfileLists({ isOwner: userOwner, userId: profile.id });
    }
  }, [tab]);

  return (
    <>
      <ProfileHeader
        username={profile.username}
        imageUrl={profile.image_url}
        isOwner={userOwner}
      />
      <ProfileInfo
        createdAt={new Date(profile.created_at)}
        description={profile.description}
        isOwner={userOwner}
      />
      <Tabs
        tabs={tabs}
        tabValue={tab}
        onChange={(newValue) => setTab(newValue)}
        css={{ mb: '0.75rem', pt: '1rem' }}
      />

      {tab === PageTabs.collections ? (
        profile.allLists.lists.items.length > 0 ? (
          <ListGrid
            items={lists}
            loadMore={loadNextPage}
            loadingMore={isLoadingMore}
            canLoadMore={hasNextPage}
          />
        ) : (
          <Text size="$lg" color="$neutral">
            Нет коллекций
          </Text>
        )
      ) : (profile.favLists?.lists?.items.map((f) => f.list) ?? []).length >
        0 ? (
        <ListGrid
          items={profile.favLists?.lists?.items.map((f) => f.list) ?? []}
          loadMore={() =>
            getMoreProfileFavLists({
              lowerBound: profile.favLists!.lists.nextKey!,
            })
          }
          loadingMore={moreFavListsLoading}
          canLoadMore={Boolean(profile.favLists?.lists.nextKey)}
        />
      ) : (
        <Text size="$lg" color="$neutral">
          Нет избранных коллекций
        </Text>
      )}
      {userOwner && (
        <Button
          size="sm"
          css={{
            mt: '$20',
            '@xsMax': {
              width: '100%',
            },
          }}
          color="gradient"
          onPress={() => logout()}
        >
          Выйти
        </Button>
      )}
    </>
  );
};

export default PageContent;
