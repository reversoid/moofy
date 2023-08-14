import { useMutation } from '@tanstack/react-query';
import { profileService } from '../api/profile.service';

export const useSubscribe = () => {
  const mutation = useMutation({
    mutationFn: (userId: number) => profileService.subscribe(userId),
    // TODO on success and error edit profile subscriptions number
  });

  return mutation;
};
