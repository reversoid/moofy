import { listService } from '@/features/list/api/list.service';
import { useMutation } from '@tanstack/react-query';

export const useUploadImage = () => {
  const mutation = useMutation({
    mutationFn: (file: File) => listService.uploadImage(file),
  });

  return mutation;
};
