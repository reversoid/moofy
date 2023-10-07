import { ListLike } from '@/features/list-like';
import { AdditinalInfo } from '@/shared/api/types/list.type';
import { Icon } from '@/shared/ui/Icon/Icon';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { Row, Text } from '@nextui-org/react';
import React, { FC, useState } from 'react';
import commentIcon from '@/shared/assets/img/comment.svg';
import { CommentsList } from './CommentsList/CommentsList';
import { SendCommentForm } from '@/widgets/comment/ui/SendCommentForm';
import { CommentButton } from '@/features/comment/ui/CommentButton';

export interface FeedbackProps {
  additionalInfo: AdditinalInfo;
  listId: number;
}

interface FeedbackControlsProps extends FeedbackProps {
  onToggleComments: () => void;
}

const FeedbackControls: FC<FeedbackControlsProps> = ({
  additionalInfo,
  listId,
  onToggleComments,
}) => {
  return (
    <Row
      css={{
        ai: 'center',
        gap: '$5',
        jc: 'flex-start',
        '@xsMax': { flexDirection: 'column', ai: 'stretch', gap: '$6' },
      }}
    >
      <ListLike
        likesAmount={additionalInfo.likesAmount}
        liked={additionalInfo.isLiked ?? false}
        listId={listId}
      />
      <CommentButton
        commentsAmount={additionalInfo.commentsAmount}
        onClick={onToggleComments}
      />
    </Row>
  );
};

export const Feedback: FC<FeedbackProps> = ({ additionalInfo, listId }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <>
      <FeedbackControls
        onToggleComments={() => setShowComments((v) => !v)}
        additionalInfo={additionalInfo}
        listId={listId}
      />

      {showComments && <CommentsList listId={listId} />}
    </>
  );
};
