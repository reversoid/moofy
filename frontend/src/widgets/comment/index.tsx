import { Comment } from '@/entities/comment';
import { CommentLike } from '@/features/comment';
import { useReplyToComment } from '@/features/comment/utils/useReplyToComment';
import {
  CommentInfo,
  Comment as IComment,
} from '@/shared/api/types/comment.type';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { Button, Link, Row, Text, styled } from '@nextui-org/react';
import ColorHash from 'color-hash';
import React, { FC, useState } from 'react';

export { commentLiked, commentUnliked } from '@/features/comment';

export const colorHash = new ColorHash();

const AnswerWrapper = styled('form', {
  mt: '$10',
});

export interface CommentWidgetProps {
  comment: IComment;
  additionalInfo: CommentInfo;
  listId: number;
  onLoadReplies?: (commentId: number) => void;
  onHideReplies?: (commentId: number) => void;
  /** Will hash comment ID and apply result color */
  colored?: boolean;
}

export const CommentWidget: FC<CommentWidgetProps> = ({
  comment,
  additionalInfo,
  listId,
  onLoadReplies,
  colored,
}) => {
  const [showTextField, setShowTextField] = useState(false);
  const replyMutation = useReplyToComment();

  return (
    <div>
      <Comment
        borderColor={colored ? colorHash.hex(String(comment.id)) : undefined}
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
          Нравится: <Text as={'span'}>{additionalInfo.likesAmount}</Text>
        </Text>
        <Link
          css={{
            fontWeight: 500,
            color: '$neutral !important',
            '&:hover': { color: '$primary !important' },
            cursor: 'pointer',
          }}
          onPress={() => {
            setShowTextField((v) => !v);
            onLoadReplies?.(comment.id);
          }}
        >
          Ответы:&nbsp;<Text as={'span'}>{additionalInfo.repliesAmount}</Text>
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
    </div>
  );
};
