import { useProfilePage } from '../../utils/useProfilePage';

export const useProfileUsername = (userId: number) => {
  const { data } = useProfilePage(userId);
  return data?.username;
};
