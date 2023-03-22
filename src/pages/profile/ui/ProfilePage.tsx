import { logout } from '@/features/auth/model/logout';
import { $getProfileState, getProfile } from '@/features/get-profile/model';
import { Button, Row, Text } from '@nextui-org/react';
import { useStore } from 'effector-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import { getLists } from '@/features/list/get-lists';
import { $lists } from '@/features/list/_model';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';

interface ProfilePageProps {
  userOwner?: boolean;
}

function ProfilePage({ userOwner }: ProfilePageProps) {
  const { id } = useParams();

  useEffect(() => {
    getProfile(id ? Number(id) : undefined);
  }, []);
  const { error, isLoading, success } = useStore($getProfileState);

  useEffect(getLists, []);
  const lists = useStore($lists);

  if (isLoading) {
    return null;
  }

  if (success) {
    return (
      <>
        <ProfileHeader username={success.username} />
        <ProfileInfo
          createdAt={new Date(success.created_at)}
          description={
            'Всем привет! Меня зовут Гоша, добро пожаловать на наш сайт!'
          }
        />

        <ListGrid items={lists?.items ?? []} />

        {userOwner && (
          <Button css={{ mt: '$5' }} color="gradient" onPress={() => logout()}>
            Выйти
          </Button>
        )}
      </>
    );
  }

  if (error === 'WRONG_USER_ID') {
    return <Text>Пользователя не существует</Text>;
  }

  return null;
}

export default ProfilePage;
