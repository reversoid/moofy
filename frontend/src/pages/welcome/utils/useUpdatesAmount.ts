import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { listService } from '@/features/list/api/list.service';

export const useUpdatesAmount = () => {
  const result = useQuery({
    queryKey: ['My updates'],
    queryFn: () => listService.getUpdatesAmount(),
  });

  return result.data?.updatesAmount
};
