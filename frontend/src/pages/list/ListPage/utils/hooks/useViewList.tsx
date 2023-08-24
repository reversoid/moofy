import { listService } from '@/features/list/api/list.service';
import { useMount } from '@/shared/hooks/useMount';
import { useMutation } from '@tanstack/react-query';

export const useViewList = (id: number) => {
  const mutation = useMutation({
    mutationFn: (id: number) => listService.markListAsViewed(id),
  });

  useMount(() => {
    mutation.mutate(id);
  });
};
