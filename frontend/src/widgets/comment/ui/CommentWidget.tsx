import { Comment } from '@/entities/comment';
import { CommentLike } from '@/features/comment';
import { CommentNode } from '@/widgets/comment/utils/comments-tree/CommentNode';
import { styled } from '@nextui-org/react';
import ColorHash from 'color-hash';
import { FC, useState } from 'react';
import { CommentInfo } from './CommentInfo';
import { ReplyForm } from './ReplyForm';

export const colorHash = new ColorHash();

const WidgetWrapper = styled('div', {
  variants: {
    reply: {
      true: {
        ml: '$5',
      },
    },
  },
});

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

  const showAndHideReplies = () => {
    if (showReplies) {
      onHideReplies?.(comment.id);
    } else {
      onLoadReplies?.(comment.id);
    }
    setShowReplies((v) => !v);
  };

  return (
    <>
      <WidgetWrapper reply={comment.reply_to !== null}>
        <Comment
          borderColor={
            commentNode.isColored
              ? colorHash.hex(String(comment.id))
              : undefined
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

        <CommentInfo
          likesAmount={info.likesAmount}
          repliesAmount={info.repliesAmount}
          onPressReplies={showAndHideReplies}
        />

        {showReplies && <ReplyForm commentId={comment.id} listId={listId} />}
      </WidgetWrapper>

      {showReplies &&
        commentNode.replies?.map((node) => (
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
  );
};
