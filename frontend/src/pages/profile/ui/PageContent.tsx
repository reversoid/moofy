import { logout } from '@/features/auth/model/logout';
import { Profile } from '@/shared/api/types/profile.type';
import { TabProps } from '@/shared/ui/Tabs/Tabs/Tab';
import Tabs from '@/shared/ui/Tabs/Tabs/Tabs';
import { Button } from '@nextui-org/react';
import { FC, useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import { ListsSection } from './ListsSection';
import { useAuth } from '@/shared/hooks/useAuth';

interface PageContentProps {
  profile: Profile;
}

const PageContent: FC<PageContentProps> = ({ profile }) => {
  const { userId } = useAuth();
  const isOwner = userId === profile.id;

  return (
    <>
      <ProfileHeader
        username={profile.username}
        imageUrl={profile.image_url}
        isOwner={isOwner}
      />

      <ProfileInfo
        createdAt={new Date(profile.created_at)}
        description={profile.description}
        isOwner={isOwner}
      />

      <ListsSection profile={profile} isOwner={isOwner} />

      {isOwner && (
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
