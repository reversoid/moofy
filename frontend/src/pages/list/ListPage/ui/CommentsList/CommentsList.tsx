import { CommentWidget } from '@/widgets/comment';
import { styled } from '@nextui-org/react';
import React, { FC } from 'react';
import { useStore } from 'effector-react';
import { $comments } from '../../model/comments';
import LoadMore from '@/shared/components/LoadMore';
import { useReplies } from '../../utils/hooks/useReplies';

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
  const comments = useStore($comments);

  if (!comments) {
    return null;
  }

  return (
    <CommentsWrapper>
      {comments.listId == listId &&
        comments.toArray()?.map((c) => {
          return (
            <CommentWidget
              commentNode={c!}
              listId={listId}
              key={c.commentWithInfo?.comment.id}
            />
          );
        })}
    </CommentsWrapper>
  );
};
