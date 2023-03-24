import { Profile } from '@/shared/api/types/profile.type';
import { FC, useEffect, useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import Tabs from '@/shared/ui/Tabs/Tabs/Tabs';
import { Button } from '@nextui-org/react';
import { logout } from '@/features/auth/model/logout';
import { TabProps } from '@/shared/ui/Tabs/Tabs/Tab';

import {
  $getMoreProfileFavListsLoading,
  getMoreProfileFavLists,
} from '../model/getProfileFavLists';
import {
  $getMoreProfileListsLoading,
  getMoreProfileLists,
} from '../model/getProfileLists';
import { useStore } from 'effector-react';

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

const PageContent: FC<PageContentProps> = ({ profile, userOwner }) => {
  const tabs: TabProps[] = userOwner ? ownerTabs : userTabs;

  const [tab, setTab] = useState<number>(PageTabs.collections);

  const moreListsLoading = useStore($getMoreProfileListsLoading);
  const moreFavListsLoading = useStore($getMoreProfileFavListsLoading);

  useEffect(() => {
    if (tab === PageTabs.favorites) {
    } else if (tab === PageTabs.collections) {
    }
  }, [tab]);

  return (
    <>
      <ProfileHeader username={profile.username} />
      <ProfileInfo
        createdAt={new Date(profile.created_at)}
        description={
          'Всем привет! Меня зовут Гоша, добро пожаловать на наш сайт!'
        }
      />
      <Tabs
        tabs={tabs}
        tabValue={tab}
        onChange={(newValue) => setTab(newValue)}
        css={{ mb: '0.75rem', pt: '1rem' }}
      />

      {tab === 0 ? (
        <ListGrid
          items={profile.allLists.lists.items}
          loadMore={() =>
            getMoreProfileLists({
              userId: profile.id,
              lowerBound: profile.allLists.lists.nextKey!,
              isOwner: userOwner,
            })
          }
          loadingMore={moreListsLoading}
          canLoadMore={Boolean(profile.allLists.lists.nextKey)}
        />
      ) : (
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
      )}

      {userOwner && (
        <Button css={{ mt: '$5' }} color="gradient" onPress={() => logout()}>
          Выйти
        </Button>
      )}
    </>
  );
};

export default PageContent;
