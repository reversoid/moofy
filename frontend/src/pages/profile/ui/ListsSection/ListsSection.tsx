import { Profile } from '@/shared/api/types/profile.type';
import { TabProps } from '@/shared/ui/Tabs/Tabs/Tab';
import Tabs from '@/shared/ui/Tabs/Tabs/Tabs';
import { FC, useState } from 'react';
import { Lists } from './Lists';

export enum PageTabs {
  collections,
  favorites,
}

const ownerTabs = [{ label: 'Мои коллекции' }, { label: 'Избранное' }];
const userTabs = [{ label: 'Все коллекции' }];

export interface ListsSectionProps {
  profile: Profile;
  isOwner: boolean;
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

      <Lists profile={profile} tab={tab} isOwner={isOwner} />
    </>
  );
};
