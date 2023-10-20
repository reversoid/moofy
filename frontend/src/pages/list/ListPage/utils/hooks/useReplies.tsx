import { useStore } from 'effector-react';
import React from 'react';
import { $comments, addReplies } from '../../model/comments';
import { useInfiniteQuery } from '@tanstack/react-query';
import { listService } from '@/features/list/api/list.service';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { CommentWithInfo } from '../../../../../widgets/comment/utils/comments-tree/CommentNode';
import { transformInfiniteIterableData } from '@/shared/utils/reactQueryAddons/transformInfiniteData';
import { useNewInfiniteData } from '@/shared/utils/reactQueryAddons/useNewInfiniteData';
import { useCachedInfiniteData } from '@/shared/utils/reactQueryAddons/useCachedInfiniteData';

export const useReplies = (listId: number, commentId: number) => {
  const comments = useStore($comments);

  const result = useInfiniteQuery<
    IterableResponse<CommentWithInfo>,
    FetchError
  >({
    queryKey: ['Comments replies', commentId],
    queryFn: ({ pageParam }) =>
      listService.getListComments(listId, pageParam, commentId),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
    enabled: false,
  });

  useNewInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);

      if (!comments) {
        return;
      }

      addReplies({
        commentId,
        comments: content,
        nextKey: result.data.pages.at(-1)?.nextKey ?? null,
      });
    }
  });

  return {
    isLoading: result.isFetching || result.isRefetching,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
    load: result.refetch,
  };
};
