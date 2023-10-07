import { Button } from '@nextui-org/react';
import React, { FC } from 'react';
import { CommentIcon } from './CommentIcon';

export interface CommentButtonProps {
  onClick?: () => void;
  commentsAmount?: number;
}

export const CommentButton: FC<CommentButtonProps> = ({
  onClick,
  commentsAmount,
}) => {
  return (
    <Button onClick={onClick} auto bordered icon={<CommentIcon />}>
      Комментарии {commentsAmount}
    </Button>
  );
};
