import { ListLike } from '@/features/list-like';
import { AdditinalInfo } from '@/shared/api/types/list.type';
import { Icon } from '@/shared/ui/Icon/Icon';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { Row, Text } from '@nextui-org/react';
import React, { FC, useState } from 'react';
import commentIcon from '@/shared/assets/img/comment.svg';
import { CommentsList } from './CommentsList/CommentsList';

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
    <Row css={{ ai: 'center', gap: '$5', jc: 'flex-start' }}>
      <Row css={{ ai: 'center', gap: '$4', w: 'auto' }}>
        <ListLike liked={additionalInfo.isLiked ?? false} listId={listId} />
        <Text css={{ fontWeight: 500, minWidth: '1.5rem', }} size={'$lg'} color="$neutral">
          {additionalInfo?.likesAmount}
        </Text>
      </Row>
      <Row css={{ ai: 'center', gap: '$5', w: 'auto' }}>
        <IconButton
          onClick={onToggleComments}
          css={{ width: '2rem', height: '2rem' }}
        >
          <Icon iconUrl={commentIcon} size="1.75rem" />
        </IconButton>
        <Text css={{ fontWeight: 500 }} size={'$lg'} color="$neutral">
          {additionalInfo?.commentsAmount}
        </Text>
      </Row>
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
