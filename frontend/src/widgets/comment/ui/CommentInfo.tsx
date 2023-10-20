import { Link, Row, Text } from '@nextui-org/react';
import React, { FC } from 'react';

export interface CommentInfoProps {
  likesAmount: number;
  repliesAmount: number;
  onPressReplies?: () => void;
}

export const CommentInfo: FC<CommentInfoProps> = ({
  likesAmount,
  repliesAmount,
  onPressReplies,
}) => {
  return (
    <Row
      css={{
        pl: '$xs',
        mt: '$2',
        display: 'flex',
        gap: '$7',
        ai: 'center',
      }}
    >
      <Text css={{ fontWeight: 500 }} as={'p'} color="$neutral">
        Нравится: <Text as={'span'}>{likesAmount}</Text>
      </Text>
      <Link
        css={{
          fontWeight: 500,
          color: '$neutral !important',
          '&:hover': { color: '$primary !important' },
          cursor: 'pointer',
        }}
        onPress={onPressReplies}
      >
        Ответы:&nbsp;<Text as={'span'}>{repliesAmount}</Text>
      </Link>
    </Row>
  );
};
