import { Profile } from '@/shared/api/types/profile.type';
import { Link } from '@/shared/ui/Link/Link';
import { Image, Text, styled } from '@nextui-org/react';
import { FC } from 'react';
import profileIcon from '@/shared/assets/img/user-round.svg';
import { formatDate } from '@/shared/utils/formatDate/formatDate';

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
      <Link to={`/profile/${user.id}`} css={{ width: 'fit-content' }}>
        <Image
          width={'2.75rem'}
          height={'2.75rem'}
          css={{
            borderRadius: '50%',
            objectFit: 'cover',
          }}
          src={user.image_url ?? profileIcon}
        />
      </Link>

      <UserInfo>
        <Link to={`/profile/${user.id}`} css={{ width: 'fit-content' }}>
          <Text h5 color="$link" css={{ margin: 0 }} size={'$lg'}>
            {user.username}
          </Text>
        </Link>

        {/* TODO make better formatting with: 5 min ago. Just now... 15 min ago or 12:12 10.10.2023 */}
        <Text color="$neutral">{formatDate(createdAt)}</Text>
      </UserInfo>
    </UserBlock>
  );
};
