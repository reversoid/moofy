import { UpdateListDTO, listService } from '@/features/list/_api/list.service';
import { useMutation } from '@tanstack/react-query';

export const useUpdateList = () => {
  const mutation = useMutation({
    mutationFn: (dto: UpdateListDTO) => listService.updateList(dto),
    onSuccess(data, variables, context) {
      // TODO update store
    },
  });
  return mutation;
};
