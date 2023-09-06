import { Profile } from '@/shared/api/types/profile.type';
import { Text, styled } from '@nextui-org/react';
import { FC } from 'react';
import { Card } from '../../shared/ui/Card';
import { User } from './ui/user';

export interface CommentProps {
  text: string;
  user: Pick<Profile, 'id' | 'image_url' | 'username'>;
  createdAt: Date;
  replyToCommentId?: number;
}

const CommentWrapper = styled(Card, {
  px: '$sm',
  py: '$xs',
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  variants: {
    reply: {
      true: {
        ml: '$5',
      },
    },
  },
});

export const Comment: FC<CommentProps> = ({
  text,
  user,
  createdAt,
  replyToCommentId,
}) => {
  return (
    <CommentWrapper reply={Boolean(replyToCommentId)}>
      <User user={user} createdAt={createdAt} />
      <Text>{text}</Text>
    </CommentWrapper>
  );
};
