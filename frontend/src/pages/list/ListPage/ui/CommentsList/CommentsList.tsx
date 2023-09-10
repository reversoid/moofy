import { CommentWidget } from '@/widgets/comment';
import { styled } from '@nextui-org/react';
import React, { FC } from 'react';

const CommentsWrapper = styled('div', {
  maxWidth: '60%',
  '@xsMax': {
    maxWidth: '100%',
  },
  d: 'flex',
  flexDirection: 'column',
  gap: '$9'
});

export interface CommentsListProps {
  comments?: Comment[];
  listId: number;
}

export const CommentsList: FC<CommentsListProps> = ({ comments, listId }) => {
  return (
    <CommentsWrapper>
      <CommentWidget
        additionalInfo={{ liked: false, likesAmount: 5, repliesAmount: 6 }}
        comment={{
          created_at: new Date().toISOString(),
          id: 5,
          reply_to: null,
          text: 'good!',
          user: {
            id: 5,
            image_url: null,
            username: 'reversoid',
          },
        }}
        listId={listId}
      />
      <CommentWidget
        additionalInfo={{ liked: false, likesAmount: 5, repliesAmount: 6 }}
        comment={{
          created_at: new Date().toISOString(),
          id: 5,
          reply_to: null,
          text: 'good!',
          user: {
            id: 5,
            image_url: null,
            username: 'reversoid',
          },
        }}
        listId={listId}
      />
      <CommentWidget
        additionalInfo={{ liked: false, likesAmount: 5, repliesAmount: 6 }}
        comment={{
          created_at: new Date().toISOString(),
          id: 5,
          reply_to: 2,
          text: 'good!',
          user: {
            id: 5,
            image_url: null,
            username: 'reversoid',
          },

        }}
        listId={listId}
      />
      <CommentWidget
        additionalInfo={{ liked: false, likesAmount: 5, repliesAmount: 6 }}
        comment={{
          created_at: new Date().toISOString(),
          id: 5,
          reply_to: null,
          text: 'good!',
          user: {
            id: 5,
            image_url: null,
            username: 'reversoid',
          },
        }}
        listId={listId}
      />
    </CommentsWrapper>
  );
};
