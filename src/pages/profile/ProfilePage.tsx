import { logout } from '@/models/app/auth/logout';
import { $getProfileState, getProfile } from '@/models/profile';
import { Button, Row, Text } from '@nextui-org/react';
import { useStore } from 'effector-react';
import React, { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface ProfilePageProps {
  userOwner?: boolean;
}

function ProfilePage({ userOwner }: ProfilePageProps) {
  const { id } = useParams();

  useEffect(() => {
    getProfile(id ? Number(id) : undefined);
  }, []);
  const { error, isLoading, success } = useStore($getProfileState);

  if (isLoading) {
    return null;
  }

  if (success) {
    return (
      <>
        <Row css={{ gap: '$3' }}>
          <Text size="lg" color="$neutral">
            Имя пользователя
          </Text>
          <Text size="lg">{success.username}</Text>
        </Row>
        <Row css={{ gap: '$3' }}>
          <Text size="lg" color="$neutral">
            Дата регистрации
          </Text>
          <Text size="lg">{new Date(success.created_at).toString()}</Text>
        </Row>

        {userOwner && (
          <Button css={{ mt: '$5' }} color="gradient" onPress={() => logout()}>
            Выйти
          </Button>
        )}
      </>
    );
  }

  if (error === 'WRONG_USER_ID') {
    return <Text>Пользователя не существует</Text>
  }

  return null;
}

export default memo(ProfilePage);
