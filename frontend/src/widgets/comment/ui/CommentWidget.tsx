import { Comment } from '@/entities/comment';
import { CommentLike } from '@/features/comment';
import { CommentNode } from '@/widgets/comment/utils/comments-tree/CommentNode';
import { styled } from '@nextui-org/react';
import ColorHash from 'color-hash';
import { FC, useState } from 'react';
import { CommentInfo } from './CommentInfo';
import { SendCommentForm } from './SendCommentForm';
import { useReplies } from '@/pages/list/ListPage/utils/hooks/useReplies';
import { removeReplies } from '@/pages/list/ListPage/model/comments';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';

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
}

export const CommentWidget: FC<CommentWidgetProps> = ({
  commentNode,
  listId,
}) => {
  const [showReplies, setShowReplies] = useState(false);

  const comment = commentNode.commentWithInfo!.comment;
  const info = commentNode.commentWithInfo!.info;

  const { load: loadReplies, isLoading } = useReplies(listId, comment.id);
  
  useLoadingBar(isLoading);

  const showAndHideReplies = () => {
    setShowReplies((showReplies) => {
      if (showReplies) {
        removeReplies({ commentId: comment.id });
      } else {
        loadReplies();
      }
      return !showReplies;
    });
  };

  return (
    <>
      <WidgetWrapper reply={Boolean(comment.reply_to)}>
        <Comment
          borderColor={commentNode.hexColor.currentColorHex ?? undefined}
          createdAt={new Date(comment.created_at)}
          text={comment.text}
          user={comment.user}
          rightContent={
            <CommentLike
              commentId={comment.id}
              liked={info.isLiked}
              listId={listId}
            />
          }
        />

        <CommentInfo
          likesAmount={info.likesAmount}
          repliesAmount={info.repliesAmount}
          onPressReplies={showAndHideReplies}
        />

        {showReplies && <SendCommentForm commentId={comment.id} listId={listId} />}
      </WidgetWrapper>

      {showReplies &&
        commentNode.replies?.map((node) => (
          <CommentWidget
            commentNode={node}
            listId={listId}
            key={node.commentWithInfo!.comment.id}
          />
        ))}
    </>
  );
};
