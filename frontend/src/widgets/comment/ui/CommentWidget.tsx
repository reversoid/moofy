import { Comment } from '@/entities/comment';
import { CommentLike } from '@/features/comment';
import { useReplyToComment } from '@/features/comment/utils/useReplyToComment';
import Textarea from '@/shared/ui/Textarea/Textarea';
import { CommentNode } from '@/widgets/comment/utils/comments-tree/CommentNode';
import { Button, Link, Row, Text, styled } from '@nextui-org/react';
import ColorHash from 'color-hash';
import { FC, useState } from 'react';
import { ReplyForm } from './ReplyForm';

export const colorHash = new ColorHash();

const WidgetWrapper = styled('div');

export interface CommentWidgetProps {
  commentNode: CommentNode;
  listId: number;
  onLoadReplies?: (commentId: number) => void;
  onHideReplies?: (commentId: number) => void;
}

export const CommentWidget: FC<CommentWidgetProps> = ({
  commentNode,
  listId,
  onLoadReplies,
  onHideReplies,
}) => {
  const [showReplies, setShowReplies] = useState(false);

  const comment = commentNode.commentWithInfo!.comment;
  const info = commentNode.commentWithInfo!.info;

  return (
    <WidgetWrapper>
      <Comment
        borderColor={
          commentNode.isColored ? colorHash.hex(String(comment.id)) : undefined
        }
        createdAt={new Date(comment.created_at)}
        text={comment.text}
        user={comment.user}
        replyToCommentId={comment.reply_to ?? undefined}
        rightContent={
          <CommentLike
            commentId={comment.id}
            liked={info.liked}
            listId={listId}
          />
        }
      />

      {/* TODO make separate component */}
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
          Нравится: <Text as={'span'}>{info.likesAmount}</Text>
        </Text>
        <Link
          css={{
            fontWeight: 500,
            color: '$neutral !important',
            '&:hover': { color: '$primary !important' },
            cursor: 'pointer',
          }}
          onPress={() => {
            if (showReplies) {
              onHideReplies?.(comment.id);
            } else {
              onLoadReplies?.(comment.id);
            }
            setShowReplies((v) => !v);
          }}
        >
          Ответы:&nbsp;<Text as={'span'}>{info.repliesAmount}</Text>
        </Link>
      </Row>

      {showReplies && (
        <>
          <ReplyForm commentId={comment.id} listId={listId} />

          {commentNode.replies?.map((node) => (
            <CommentWidget
              commentNode={node}
              listId={listId}
              key={node.commentWithInfo?.comment.id}
              onLoadReplies={() =>
                onLoadReplies?.(node.commentWithInfo!.comment.id)
              }
              onHideReplies={() =>
                onHideReplies?.(node.commentWithInfo!.comment.id)
              }
            />
          ))}
        </>
      )}
    </WidgetWrapper>
  );
};
