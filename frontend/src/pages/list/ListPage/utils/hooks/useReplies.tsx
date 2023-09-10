import { useStore } from 'effector-react';
import React from 'react';
import { $comments } from '../../model/comments';
import { useInfiniteQuery } from '@tanstack/react-query';
import { listService } from '@/features/list/api/list.service';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { CommentWithInfo } from '../comments-tree/CommentNode';
import { transformInfiniteIterableData } from '@/shared/lib/reactQueryAddons/transformInfiniteData';
import { useNewInfiniteData } from '@/shared/lib/reactQueryAddons/useNewInfiniteData';

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
      comments.addReplies(
        commentId,
        content,
        result.data.pages.at(-1)?.nextKey ?? null,
      );
    }
  });

  return {
    isLoading: result.isLoading || result.isRefetching,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
    load: result.refetch(),
  };
};
