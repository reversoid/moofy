import { Button, Text } from '@nextui-org/react';
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
      <Text
        css={{
          '@xsMax': { display: 'none' },
          color: 'inherit',
          fontSize: 'inherit',
          fontWeight: 'inherit',
        }}
      >
        Комментарии
      </Text>
      &nbsp;
      {commentsAmount}
    </Button>
  );
};
