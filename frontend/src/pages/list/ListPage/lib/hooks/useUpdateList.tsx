import { UpdateListDTO, listService } from '@/features/list/api/list.service';
import { useMutation } from '@tanstack/react-query';
import { updateList } from '../../model/updateList';

export const useUpdateList = () => {
  const mutation = useMutation({
    mutationFn: (dto: UpdateListDTO) => listService.updateList(dto),
    onSuccess(data) {
      updateList({ list: data });
    },
  });
  return mutation;
};
