import { Comment } from '@/entities/comment';
import { CommentLike } from '@/features/comment';
import { useReplyToComment } from '@/features/comment/utils/useReplyToComment';
import { Comment as IComment } from '@/shared/api/types/comment.type';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Button, Link, Row, Text, styled } from '@nextui-org/react';
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
  onLoadReplies?: (commentId: number) => void;
}

export const CommentWidget: FC<CommentWidgetProps> = ({
  comment,
  additionalInfo,
  listId,
  onLoadReplies,
}) => {
  const [showTextField, setShowTextField] = useState(false);
  const replyMutation = useReplyToComment();

  return (
    <div>
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

      <Row
        css={{
          pl: '$xs',
          mt: '$2',
          display: 'flex',
          gap: '$7',
          ai: 'center',
          ml: comment.reply_to !== null ? '$5' : 0,
        }}
      >
        <Text css={{ fontWeight: 500 }} as={'p'} color="$neutral">
          Нравится: <Text as={'span'}>5675</Text>
        </Text>
        <Link
          css={{
            fontWeight: 500,
            color: '$neutral !important',
            '&:hover': { color: '$primary !important' },
            cursor: 'pointer',
          }}
          onPress={() => setShowTextField((v) => !v)}
        >
          Ответить
        </Link>
      </Row>

      {showTextField && (
        <AnswerWrapper>
          <Textarea maxLength={400} placeholder="Ваш ответ" size="lg" />
          <Button
            type="submit"
            css={{ mt: '$8', '@xsMax': { w: '100%' } }}
            color={'primary'}
            disabled={replyMutation.isLoading}
            onClick={() =>
              replyMutation.mutate({
                commentId: comment.id,
                listId: listId,
                text: 'test reply',
              })
            }
          >
            Отправить
          </Button>
        </AnswerWrapper>
      )}

      <Row css={{ pl: '$xs', mt: '$8', jc: 'center' }}>
        <Link
          css={{
            fontWeight: 500,
            color: '$neutral !important',
            '&:hover': { color: '$primary !important' },
            cursor: 'pointer',
          }}
          onPress={() => onLoadReplies?.(comment.id)}
        >
          — Показать 77 ответов
        </Link>
      </Row>
    </div>
  );
};
