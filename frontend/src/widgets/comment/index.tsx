import { Comment } from '@/entities/comment';
import { CommentLike } from '@/features/comment';
import { Comment as IComment } from '@/shared/api/types/comment.type';
import { Row, Text, styled } from '@nextui-org/react';
import React, { FC } from 'react';

export { commentLiked, commentUnliked } from '@/features/comment';

export interface CommentWidgetProps {
  comment: IComment;
  additionalInfo: {
    liked: boolean;
    likesAmount: number;
    repliesAmount: number;
  };
  listId: number;
}

const CommentControls = styled('div', {
  position: 'relative',
  top: 'calc(-$15 - $sm)',
  left: '$sm',
});

export const CommentWidget: FC<CommentWidgetProps> = ({
  comment,
  additionalInfo,
  listId,
}) => {
  return (
    <>
      <Comment
        createdAt={new Date(comment.created_at)}
        text={comment.text}
        user={comment.user}
        replyToCommentId={comment.reply_to ?? undefined}
        rightContent={
          <CommentLike
            commentId={comment.id}
            liked={!additionalInfo.liked}
            listId={listId}
          />
        }
      />

      <Row css={{ pl: '$xs', mt: '$2', display: 'flex', gap: '$7' }}>
        <Text css={{ fontWeight: 500 }} as={'p'} color="$neutral">
          Нравится: <Text as={'span'}>5675</Text>
        </Text>
        <Text css={{ fontWeight: 500 }} as={'p'} color="$neutral">
          Ответы: <Text as={'span'}>66</Text>
        </Text>
      </Row>
    </>
  );
};
