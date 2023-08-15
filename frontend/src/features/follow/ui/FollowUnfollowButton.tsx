import { Button, Loading } from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import { useFollow } from '../utils/useFollow';
import { useUnfollow } from '../utils/useUnfollow';
import { useAuth } from '@/app';

export interface SubscribeButtonProps {
  isSubsribed: boolean;
  userId: number;
}

export const FollowUnfollowButton: FC<SubscribeButtonProps> = ({
  isSubsribed: isUserSubscribed,
  userId,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(isUserSubscribed);

  useEffect(() => {
    setIsSubscribed(isUserSubscribed);
  }, [isUserSubscribed]);

  const followMutation = useFollow({
    onSuccess() {
      setIsSubscribed(true);
    },
  });
  const unfollowMutation = useUnfollow({
    onSuccess() {
      setIsSubscribed(false);
    },
  });

  return (
    <>
      {isSubscribed ? (
        <Button
          color={'gradient'}
          css={{ alignSelf: 'center', '@xsMax': { width: '100%' } }}
          onClick={() => unfollowMutation.mutate(userId)}
          disabled={unfollowMutation.isLoading}
          bordered
        >
          {unfollowMutation.isLoading ? (
            <Loading type="points" />
          ) : (
            'Отписаться'
          )}
        </Button>
      ) : (
        <Button
          color={'gradient'}
          css={{ alignSelf: 'center', '@xsMax': { width: '100%' } }}
          onClick={() => followMutation.mutate(userId)}
          disabled={followMutation.isLoading}
        >
          {followMutation.isLoading ? <Loading type="points" /> : 'Подписаться'}
        </Button>
      )}
    </>
  );
};
