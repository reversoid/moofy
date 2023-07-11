import { Profile } from '@/shared/api/types/profile.type';
import { ApiError } from '@/shared/api/types/shared';
import { useAuth } from '@/shared/hooks/useAuth';
import { Text } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { profileService } from '../api/profile.service';
import PageContent from './PageContent';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';

const useId = () => {
  const { id } = useParams();
  return Number(id);
};

const useProfilePage = (id: number) => {
  const { isLoading, data, isRefetching, error } = useQuery<Profile, ApiError>({
    queryKey: ['Profile page', id],
    queryFn: () => profileService.getProfile(),
  });

  return { isLoading: isLoading || isRefetching, data, error };
};

function ProfilePage() {
  const id = useId();
  const { data, isLoading, error } = useProfilePage(id);
  const { userId } = useAuth();

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
