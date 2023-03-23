import { Profile } from '@/shared/api/types/profile.type';
import { FC, useEffect, useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import Tabs from '@/shared/ui/Tabs/Tabs/Tabs';
import { IterableResponse } from '@/shared/api/types/shared';
import { List } from '@/shared/api/types/list.type';
import { Button } from '@nextui-org/react';
import { logout } from '@/features/auth/model/logout';
import { TabProps } from '@/shared/ui/Tabs/Tabs/Tab';

interface PageContentProps {
  profile: Profile;
  userOwner?: boolean;
}

const ownerTabs = [{ label: 'Мои коллекции' }, { label: 'Избранное' }];
const userTabs = [{ label: 'Все коллекции' }];
const FIRST_TAB = 0;

const PageContent: FC<PageContentProps> = ({ profile, userOwner }) => {
  const tabs: TabProps[] = userOwner ? ownerTabs : userTabs;

  const [tab, setTab] = useState<number>(FIRST_TAB);

  const [lists, setLists] = useState<{
    lists: IterableResponse<List>;
    count: number;
  }>(profile.allLists);

  useEffect(() => {
    console.log(tab);
    // fetch profile lists of fav lists
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
      <ListGrid items={profile.allLists.lists.items} />

      {userOwner && (
        <Button css={{ mt: '$5' }} color="gradient" onPress={() => logout()}>
          Выйти
        </Button>
      )}
    </>
  );
};

export default PageContent;
