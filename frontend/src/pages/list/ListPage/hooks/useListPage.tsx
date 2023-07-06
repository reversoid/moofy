import { ListWithContentResponse, listService } from '@/features/list/_api/list.service';
import { FetchError } from '@/shared/api/types/shared';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export const useListPage = () => {
  const { id } = useParams();

  const { data, error, isLoading } = useQuery<
    ListWithContentResponse,
    FetchError
  >({
    queryKey: ['Load list page', id],
    queryFn: () => listService.getMyListWithContent(Number(id)),
  });

  return { data, error, isLoading };
};
