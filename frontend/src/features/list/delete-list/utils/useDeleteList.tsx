import { listService } from '@/features/list/api/list.service';
import { useMutation } from '@tanstack/react-query';
import { deleteList } from '../model';

export const useDeleteList = () => {
  const mutation = useMutation({
    mutationFn: ({ listId }: { listId: number }) =>
      listService.deleteList(listId),
    onSuccess(data) {
      deleteList({ listId: data.listId });
    },
  });

  return mutation;
};
