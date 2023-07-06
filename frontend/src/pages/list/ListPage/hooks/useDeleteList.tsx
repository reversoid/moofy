import { listService } from '@/features/list/_api/list.service';
import { useMutation } from '@tanstack/react-query';

export const useDeleteList = () => {
  const mutation = useMutation({
    mutationFn: (id: number) => listService.deleteList(id),
    onSuccess(data, variables, context) {
      // TODO delete from store
    },
  });
  return mutation;
};
