import { useStore } from 'effector-react';
import React from 'react';
import { $comments, setupComments } from '../../model/comments';
import { useInfiniteQuery } from '@tanstack/react-query';
import { listService } from '@/features/list/api/list.service';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { CommentWithInfo } from '../../../../../widgets/comment/utils/comments-tree/CommentNode';
import { useCachedInfiniteData } from '@/shared/utils/reactQueryAddons/useCachedInfiniteData';
import { transformInfiniteIterableData } from '@/shared/utils/reactQueryAddons/transformInfiniteData';
import { useNewInfiniteData } from '@/shared/utils/reactQueryAddons/useNewInfiniteData';

export const useComments = (listId: number) => {
  const comments = useStore($comments);

  const result = useInfiniteQuery<
    IterableResponse<CommentWithInfo>,
    FetchError
  >({
    queryKey: ['List comments', listId],
    queryFn: ({ pageParam }) => listService.getListComments(listId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
    enabled: false,
  });

  useCachedInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      if (!comments) {
        setupComments({
          listId,
          comments: content,
          nextKey: result.data.pages.at(-1)?.nextKey ?? null,
        });
      }
    }
  });

  useNewInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setupComments({
        listId,
        comments: content,
        nextKey: result.data.pages.at(-1)?.nextKey ?? null,
      });
    }
  });

  return {
    data: comments?.listId === listId ? comments : undefined,
    isLoading: result.isFetching,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
    load: result.refetch,
  };
};
