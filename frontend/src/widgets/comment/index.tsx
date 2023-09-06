import { Comment } from '@/entities/comment';
import { CommentLike } from '@/features/comment';
import { useReplyToComment } from '@/features/comment/utils/useReplyToComment';
import { Comment as IComment } from '@/shared/api/types/comment.type';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Button, Row, Text, styled } from '@nextui-org/react';
import React, { FC, useState } from 'react';

export { commentLiked, commentUnliked } from '@/features/comment';

const AnswerWrapper = styled('form', {
  mt: '$10',
});

export interface CommentWidgetProps {
  comment: IComment;
  additionalInfo: {
    liked: boolean;
    likesAmount: number;
    repliesAmount: number;
  };
  listId: number;
}

export const CommentWidget: FC<CommentWidgetProps> = ({
  comment,
  additionalInfo,
  listId,
}) => {
  const [showTextField, setShowTextField] = useState(false);
  const replyMutation = useReplyToComment();

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
        <Text
          onClick={() => setShowTextField(true)}
          css={{ fontWeight: 500 }}
          as={'p'}
          color="$neutral"
        >
          Ответить
        </Text>
      </Row>

      {showTextField && (
        <AnswerWrapper>
          <Textarea maxLength={400} placeholder="Ваш ответ" size="lg" />
          <Button type="submit" css={{ mt: '$5' }} color={'primary'}>
            Отправить
          </Button>
        </AnswerWrapper>
      )}

      <Row css={{ pl: '$xs', mt: '$5', jc: 'center' }}>
        <Text css={{ fontWeight: 500 }} as={'p'} color="$neutral">
          — Показать 77 ответов
        </Text>
      </Row>
    </>
  );
};
