import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { Text } from '@nextui-org/react';
import { useParams } from 'react-router-dom';
import { useProfilePage } from '../lib/useProfilePage';
import PageContent from './PageContent';

export const useId = () => {
  const { id } = useParams();
  return Number(id);
};

function ProfilePage() {
  const id = useId();
  const { data, isLoading, error } = useProfilePage(id);

  useLoadingBar(isLoading);

  if (data) {
    return <PageContent profile={data} />;
  }

  if (error?.message === 'WRONG_USER_ID') {
    return <Text>Пользователя не существует</Text>;
  }

  return null;
}

export default ProfilePage;
