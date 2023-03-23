import { Profile } from '@/shared/api/types/profile.type';
import { FC, useEffect, useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import Tabs from '@/shared/ui/Tabs/Tabs/Tabs';
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

  const [lists, setLists] = useState(profile.allLists);
  const [favLists, setFavLists] = useState(profile.favLists);

  useEffect(() => {
    console.log(tab);
    // fetch profile lists of fav lists
  }, [tab]);

//   useEffect(() => {
//     setLists()
//   }, [listsResult]);

//   useEffect(() => {
//     setFavLists()
//   }, [favListsResult]);

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
        <ListGrid items={profile.allLists.lists.items} />
      ) : (
        <ListGrid
          items={profile.favLists?.lists?.items.map((f) => f.list) ?? []}
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
