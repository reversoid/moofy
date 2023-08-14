import { PictureIcon } from '@/shared/Icons/Picture.icon';
import { ProfileImageModal } from '@/widgets/profile-image-modal';
import { Row, Text, styled } from '@nextui-org/react';
import { FC, useState } from 'react';
import { UserImageContainer } from './UserImageContainer';
import { StatsCounters } from './StatsCounters/StatsCounters';
import { SubscriptionsInfo } from '@/shared/api/types/profile.type';

export interface ProfileHeaderProps {
  username: string;
  imageUrl: string | null;
  isOwner: boolean;
  subscriptionsInfo: SubscriptionsInfo;
}

const UserImg = styled('img', {
  width: '6rem',
  height: '6rem',
  objectFit: 'contain',
  borderRadius: '50%',
});

const ProfileHeader: FC<ProfileHeaderProps> = ({
  username,
  imageUrl,
  isOwner,
  subscriptionsInfo,
}) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  return (
    <>
      <ProfileImageModal
        imageUrl={imageUrl}
        opened={imageModalOpen}
        setOpened={setImageModalOpen}
      />
      <Row css={{ flexDirection: 'column', gap: '$5', alignItems: 'center' }}>
        <UserImageContainer
          onClick={() => setImageModalOpen(true)}
          isOwner={isOwner}
        >
          {imageUrl ? (
            <UserImg src={imageUrl} />
          ) : (
            <PictureIcon color="#ecedee" size="3.5rem" />
          )}
        </UserImageContainer>
        <Text h1 css={{ textAlign: 'center' }}>
          {username}
        </Text>
        <StatsCounters
          followed={subscriptionsInfo.followedAmount}
          followers={subscriptionsInfo.followersAmount}
        />
      </Row>
    </>
  );
};

export default ProfileHeader;
