import { authorize } from '@/app';
import { LoginDTO, authService } from '@/features/auth';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: (dto: LoginDTO) => authService.login(dto),
    onSuccess(data) {
      authorize({ userId: data.userId });
    },
  });

  return mutation;
};
