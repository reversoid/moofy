import { Profile } from '@/shared/api/types/profile.type';
import { Image, Text, styled } from '@nextui-org/react';
import { FC } from 'react';
import { Card } from '../../shared/ui/Card';
import { Heart } from '@/shared/ui/Heart';
import profileIcon from '@/shared/assets/img/user-round.svg';
import { Link } from '@/shared/ui/Link/Link';
import { formatDate } from '@/shared/lib/formatDate/formatDate';

export interface CommentProps {
  text: string;
  user: Pick<Profile, 'id' | 'image_url' | 'username'>;
  createdAt: Date;
  like?: {
    onCommentLikeChange: (liked: boolean) => void;
    liked: boolean;
    loading: boolean;
  };
  replyToCommentId?: number;
}

const UserBlock = styled('div', {
  display: 'flex',
  ai: 'center',
  gap: '$6',
});

const UserInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  jc: 'space-between',
  ai: 'flex-start',
  flexGrow: 2,
});

interface UserProps {
  user: Pick<Profile, 'id' | 'image_url' | 'username'>;
  createdAt: Date;
}

export const User: FC<UserProps> = ({ user, createdAt }) => {
  return (
    <UserBlock>
      <Image
        width={'2.75rem'}
        height={'2.75rem'}
        css={{
          borderRadius: '50%',
          objectFit: 'cover',
        }}
        src={user.image_url ?? profileIcon}
      />

      <UserInfo>
        <Link to={`/profile/${user.id}`} css={{ width: 'fit-content' }}>
          <Text h5 color="$link" css={{ margin: 0 }} size={'$lg'}>
            {user.username}
          </Text>
        </Link>
        <Text color="$neutral">{formatDate(createdAt)}</Text>
      </UserInfo>
    </UserBlock>
  );
};

const CommentWrapper = styled(Card, {
  px: '$sm',
  py: '$xs',
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  variants: {
    reply: {
      true: {
        ml: '$5'
      },
    },
  },
});

export const Comment: FC<CommentProps> = ({
  text,
  user,
  like,
  createdAt,
  replyToCommentId,
}) => {
  return (
    <CommentWrapper reply={Boolean(replyToCommentId)}>
      <User user={user} createdAt={createdAt} />
      <Text>{text}</Text>

      {/* TODO should heart be here? */}
      {like && (
        <Heart
          liked={like.liked}
          loading={like.loading}
          onChange={like.onCommentLikeChange}
        />
      )}
    </CommentWrapper>
  );
};
