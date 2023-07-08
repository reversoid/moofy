import { useMutation } from '@tanstack/react-query';
import { CreateListDTO, listService } from '../../_api/list.service';
import { addList } from '@/entities/user-lists';

export const useCreateListModal = () => {
  const mutation = useMutation({
    mutationFn: (dto: CreateListDTO) => listService.createList(dto),
    onSuccess(data) {
      addList(data);
    },
  });

  return mutation;
};
