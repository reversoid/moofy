import { listService } from '@/features/list/_api/list.service';
import { deleteList } from '@/features/list/delete-list';
import { useMutation } from '@tanstack/react-query';

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
