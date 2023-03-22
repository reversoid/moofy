import { Row, Text, styled } from '@nextui-org/react';
import React, { FC } from 'react';

export interface ProfileHeaderProps {
  username: string;
}

const UserImg = styled('div', {
  borderRadius: '50%',
  backgroundColor: '$neutral',
  width: '6rem',
  height: '6rem'
});

const ProfileHeader: FC<ProfileHeaderProps> = ({ username }) => {
  return (
    <Row css={{ flexDirection: 'column', gap: '$5', alignItems: 'center' }}>
      <UserImg />
      <Text h1 css={{ textAlign: 'center' }}>
        {username}
      </Text>
    </Row>
  );
};

export default ProfileHeader;
