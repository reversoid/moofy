import React from 'react';
import { useUpdates } from './utils/useUpdates';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';

export const UpdatesPage = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useUpdates();

  useLoadingBar(isLoading);

  return <div>Some updates here</div>;
};

export default UpdatesPage;
