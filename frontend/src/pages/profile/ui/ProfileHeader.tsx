import { Button, Loading, Row, Text, styled } from '@nextui-org/react';
import React, { FC, useState } from 'react';
import profileIcon from '@/shared/assets/img/user-round.svg';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { BasicImageUpload } from '@/shared/components/BasicImageUpload';
import {
  $uploadImageProfileState,
  uploadImage,
} from '../model/uploadProfileImage';
import { useStore } from 'effector-react';
import { ProfileImageModal } from '@/widgets/profile-image-modal';
import { PictureIcon } from '@/shared/Icons/Picture.icon';

export interface ProfileHeaderProps {
  username: string;
  imageUrl: string | null;
}

const UserImageContainer = styled('div', {
  borderRadius: '50%',
  backgroundColor: '$gray100 !important',
  width: '6rem !important',
  height: '6rem !important',
  display: 'flex',
  ai: 'center',
  jc: 'center',
});

const UserImg = styled('img', {
  width: '6rem',
  height: '6rem',
  objectFit: 'contain',
  borderRadius: '50%'
});

const ProfileHeader: FC<ProfileHeaderProps> = ({ username, imageUrl }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  return (
    <>
      <ProfileImageModal imageUrl={imageUrl} opened={imageModalOpen} setOpened={setImageModalOpen}/>
      <Row css={{ flexDirection: 'column', gap: '$5', alignItems: 'center' }}>
        <UserImageContainer onClick={() => setImageModalOpen(true)}>
          {imageUrl ? (
            <UserImg src={imageUrl} />
          ) : (
            <PictureIcon color="#ecedee" size="3.5rem" />
          )}
          
        </UserImageContainer>
        <Text h1 css={{ textAlign: 'center' }}>
          {username}
        </Text>
      </Row>
    </>
  );
};

export default ProfileHeader;
