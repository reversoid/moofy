import { Profile } from '@/shared/api/types/profile.type';
import { Button } from '@nextui-org/react';
import { FC } from 'react';
import { ListsSection } from './ListsSection/ListsSection';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import { useLogout } from '@/features/auth';
import { useAuth } from '@/app/auth';

interface PageContentProps {
  profile: Profile;
}

const PageContent: FC<PageContentProps> = ({ profile }) => {
  const { userId } = useAuth();
  const isOwner = userId === profile.id;
  const mutation = useLogout()

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

          onPress={() => mutation.mutate()}
        >
          Выйти
        </Button>
      )}
    </>
  );
};

export default PageContent;
