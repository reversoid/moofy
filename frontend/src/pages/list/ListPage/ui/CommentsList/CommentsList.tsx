import { CommentWidget } from '@/widgets/comment';
import { Button, styled } from '@nextui-org/react';
import { FC, PropsWithChildren, useEffect } from 'react';
import { useComments } from '../../utils/hooks/useComments';
import {
  SendCommentForm,
  SendCommentFormWrapper,
} from '@/widgets/comment/ui/SendCommentForm';
import LoadMore from '@/shared/components/LoadMore';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { useAuth } from '@/app';

const CommentsWrapper = styled('div', {
  maxWidth: '60%',
  '@xsMax': {
    maxWidth: '100%',
  },
  d: 'flex',
  flexDirection: 'column',
  gap: '$9',
  mt: '$10',
});

export interface CommentsListProps {
  listId: number;
}

export const CommentsList: FC<CommentsListProps> = ({ listId }) => {
  const {
    load,
    data: comments,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useComments(listId);

  useEffect(() => {
    load();
  }, []);

  useLoadingBar(isLoading);
  const { isLoggedIn } = useAuth();

  return (
    <>
      <CommentsWrapper>
        {isLoggedIn && (
          <SendCommentFormWrapper css={{ mt: 0 }}>
            <SendCommentForm listId={listId} />
          </SendCommentFormWrapper>
        )}

        {comments?.tree.replies?.map((c) => {
          return (
            <CommentWidget
              commentNode={c!}
              listId={listId}
              key={c.commentWithInfo!.comment.id}
            />
          );
        })}
        {hasNextPage && (
          <LoadMore loadMore={fetchNextPage} loading={isFetchingNextPage} />
        )}
      </CommentsWrapper>
    </>
  );
};
