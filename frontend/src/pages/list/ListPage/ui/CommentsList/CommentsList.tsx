import { CommentWidget } from '@/widgets/comment';
import { Textarea, styled } from '@nextui-org/react';
import React, { FC, useEffect } from 'react';
import { useStore } from 'effector-react';
import { $comments } from '../../model/comments';
import LoadMore from '@/shared/components/LoadMore';
import { useReplies } from '../../utils/hooks/useReplies';
import { useCreateComment } from '@/features/comment/utils/useCreateComment';
import { useComments } from '../../utils/hooks/useComments';
import { useReplyToComment } from '@/features/comment/utils/useReplyToComment';

const CommentsWrapper = styled('div', {
  maxWidth: '60%',
  '@xsMax': {
    maxWidth: '100%',
  },
  d: 'flex',
  flexDirection: 'column',
  gap: '$9',
});

export interface CommentsListProps {
  listId: number;
}

export const CommentsList: FC<CommentsListProps> = ({ listId }) => {
  const { data: comments, load } = useComments(listId);
  const { load: loadReplies } = useReplies(listId, 8);

  useEffect(() => {
    load();
  }, []);

  return (
    <CommentsWrapper>
      {comments?.tree.replies?.map((c) => {
        return (
          <CommentWidget
            commentNode={c!}
            listId={listId}
            key={c.commentWithInfo?.comment.id}
            onLoadReplies={() => loadReplies()}
          />
        );
      })}
    </CommentsWrapper>
  );
};
