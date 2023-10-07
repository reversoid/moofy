import { FC } from 'react';
import { useLikeList } from './utils/useLikeList';
import { useUnlikeList } from './utils/useUnlikeList';
import { Button, Row, Text } from '@nextui-org/react';
import { HeartIcon } from './HeartIcon';
import { useAuth } from '@/app';
export * from './utils/useLikeList';
export * from './model';

export interface ListLikeProps {
  listId: number;
  liked: boolean;
  likesAmount?: number;
}

export const ListLike: FC<ListLikeProps> = ({ listId, liked, likesAmount }) => {
  const { isLoggedIn } = useAuth();
  const likeMutation = useLikeList();
  const unlikeMutation = useUnlikeList();

  const loading = likeMutation.isLoading || unlikeMutation.isLoading;

  const handleClick = () => {
    if (liked) {
      unlikeMutation.mutate({ listId });
    } else {
      likeMutation.mutate({ listId });
    }
  };

  return (
    <Button
      disabled={!isLoggedIn || loading}
      auto
      color="error"
      bordered={!liked}
      icon={<HeartIcon fill="currentColor" filled />}
      onClick={handleClick}
      css={{ border: liked ? '2px solid transparent' : undefined }}
    >
      <Text
        css={{
          '@xsMax': { display: 'none' },
          color: 'inherit',
          fontSize: 'inherit',
          fontWeight: 'inherit',
        }}
      >
        Нравится
      </Text>
      &nbsp;
      {likesAmount}
    </Button>
  );
};
