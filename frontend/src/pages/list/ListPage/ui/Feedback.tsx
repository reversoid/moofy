import { CommentButton } from '@/features/comment/ui/CommentButton';
import { ListLike } from '@/features/list-like';
import { AdditinalInfo } from '@/shared/api/types/list.type';
import { Row } from '@nextui-org/react';
import { FC, useState } from 'react';
import { CommentsList } from './CommentsList/CommentsList';
import { useAuth } from '@/app';

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
