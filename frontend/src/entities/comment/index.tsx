import { Profile } from '@/shared/api/types/profile.type';
import { Text, styled } from '@nextui-org/react';
import { FC } from 'react';
import { Card } from '../../shared/ui/Card';
import { User } from './ui/user';

export interface CommentProps {
  text: string;
  user: Pick<Profile, 'id' | 'image_url' | 'username'>;
  createdAt: Date;
  rightContent?: JSX.Element;
  /** This option will color left border */
  borderColor?: string;
}

const CommentWrapper = styled(Card, {
  pr: '$sm',
  pt: '$xs',
  pb: '$sm',
  pl: '$md',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  gap: '$2',
  variants: {
    withRightContent: {
      true: {
        pr: 'calc(45px + $sm)',
      },
    },
  },
  borderLeft: '3px solid transparent',
});

const RightContentWrapper = styled('div', {
  position: 'absolute',
  top: '50%',
  right: '$sm',
  transform: 'translateY(-50%)',
});

export const Comment: FC<CommentProps> = ({
  text,
  user,
  createdAt,
  rightContent,
  borderColor,
}) => {
  return (
    <>
      <CommentWrapper
        withRightContent={Boolean(rightContent)}
        css={{ borderColor: borderColor }}
      >
        <User user={user} createdAt={createdAt} />
        <Text>{text}</Text>
        {rightContent && (
          <RightContentWrapper>{rightContent}</RightContentWrapper>
        )}
      </CommentWrapper>
    </>
  );
};
