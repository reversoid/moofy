import { CommentWidget } from '@/widgets/comment';
import { styled } from '@nextui-org/react';
import { FC, useEffect } from 'react';
import { useComments } from '../../utils/hooks/useComments';

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
  const { load, data: comments } = useComments(listId);

  console.log('rerender');

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
            key={c.commentWithInfo!.comment.id}
          />
        );
      })}
    </CommentsWrapper>
  );
};
