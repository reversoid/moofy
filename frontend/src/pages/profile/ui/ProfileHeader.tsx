import { Button, Loading, Row, Text, styled } from '@nextui-org/react';
import React, { FC } from 'react';
import profileIcon from '@/shared/assets/img/user-round.svg';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { BasicImageUpload } from '@/shared/components/BasicImageUpload';
import {
  $uploadImageProfileState,
  uploadImage,
} from '../model/uploadProfileImage';
import { useStore } from 'effector-react';

export interface ProfileHeaderProps {
  username: string;
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
  width: '5rem',
  height: '5rem',
  objectFit: 'contain',
});

const ProfileHeader: FC<ProfileHeaderProps> = ({ username }) => {
  const { loading } = useStore($uploadImageProfileState);

  return (
    <Row css={{ flexDirection: 'column', gap: '$5', alignItems: 'center' }}>
      <UserImageContainer>
        <BasicImageUpload
          onFileSelect={(file) => uploadImage({ file })}
          css={{ width: '6rem', height: '6rem', borderRadius: '50%' }}
        >
          {loading ? <Loading size='lg' /> : <UserImg src={profileIcon} />}
        </BasicImageUpload>
        {/* <PictureIcon color='#ecedee' size='3.5rem' /> */}
      </UserImageContainer>
      <Text h1 css={{ textAlign: 'center' }}>
        {username}
      </Text>
    </Row>
  );
};

export default ProfileHeader;
