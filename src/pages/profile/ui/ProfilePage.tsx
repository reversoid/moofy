import { $getProfileState, clearState, getProfile } from '../model';
import { Text } from '@nextui-org/react';
import { useStore } from 'effector-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageContent from './PageContent';

interface ProfilePageProps {
  userOwner?: boolean;
}

function ProfilePage({ userOwner }: ProfilePageProps) {
  const { id } = useParams();

  useEffect(() => {
    getProfile(id ? Number(id) : undefined);
  }, []);
  const { error, isLoading, result } = useStore($getProfileState);

  const matchingId = Number(id) === result?.id;
  const ownerPage = !id;

  if (result && (matchingId || ownerPage)) {
    return <PageContent profile={result} userOwner={userOwner} />;
  }

  if (isLoading) {
    return null;
  }

  if (error === 'WRONG_USER_ID') {
    return <Text>Пользователя не существует</Text>;
  }

  return null;
}

export default ProfilePage;
