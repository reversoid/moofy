import { unAuthorize } from '@/app';
import { LoginDTO, authService } from '@/features/auth';
import { useMutation } from '@tanstack/react-query';

export const useLogout = () => {
  const mutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess() {
      unAuthorize();
    },
  });

  return mutation;
};
