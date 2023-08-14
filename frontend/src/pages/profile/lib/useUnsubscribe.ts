import { useMutation } from '@tanstack/react-query';
import { profileService } from '../api/profile.service';

export const useUnsubscribe = () => {
  const mutation = useMutation({
    mutationFn: (userId: number) =>
      profileService.unsubscribe(userId),
  });

  return mutation;
};
