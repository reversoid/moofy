import { authorize } from '@/app';
import { RegisterDTO, authService } from '@/features/auth';
import { useMutation } from '@tanstack/react-query';

export const useRegister = () => {
  const mutation = useMutation({
    mutationFn: (dto: RegisterDTO) => authService.register(dto),
    onSuccess(data) {
      authorize({ userId: data.userId });
    },
  });

  return mutation;
};
