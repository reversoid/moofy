import { PictureIcon } from '@/shared/Icons/Picture.icon';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { ProfileImageModal } from '@/widgets/profile-image-modal';
import { Button, Row, Text, styled } from '@nextui-org/react';
import { FC, useState } from 'react';
import { UserImageContainer } from './UserImageContainer';
import { StatsCounters } from './StatsCounters/StatsCounters';

export interface ProfileHeaderProps {
  username: string;
  imageUrl: string | null;
  isOwner: boolean;
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
        <StatsCounters followed={123} followers={123} />
      </Row>
    </>
  );
};

export default ProfileHeader;
