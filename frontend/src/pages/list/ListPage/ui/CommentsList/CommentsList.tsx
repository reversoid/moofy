import { CommentWidget } from '@/widgets/comment';
import { styled } from '@nextui-org/react';
import React, { FC } from 'react';
import { CommentsTree } from '../../utils/comments-tree/CommentsTree';
import { Comment } from '@/shared/api/types/comment.type';

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
  comments?: CommentsTree;
  listId: number;
}

export const CommentsList: FC<CommentsListProps> = ({ comments, listId }) => {
  if (!comments) {
    return null;
  }

  return (
    <CommentsWrapper>
      {comments.listId == listId &&
        comments.toArray()?.map((c) => (
          <CommentWidget
            colored={c.isColored}
            additionalInfo={{
              liked: c.commentWithInfo!.stats.liked,
              likesAmount: c.commentWithInfo!.stats.likesAmount,
              repliesAmount: c.commentWithInfo!.stats.repliesAmount,
            }}
            comment={c.commentWithInfo!.comment}
            listId={listId}
          />
        ))}
    </CommentsWrapper>
  );
};
