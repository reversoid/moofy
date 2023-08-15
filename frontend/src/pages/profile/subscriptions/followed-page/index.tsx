import { UserItem } from '@/entities/user-item';
import { Stack } from '@/shared/ui/Stack';
import { Text } from '@nextui-org/react';

export const FollowedPage = () => {
  return (
    <>
      <Text h1>Подписки</Text>
      <Stack>
        <UserItem
          profile={{
            additionalInfo: { isSubscribed: true },
            description: 'desc',
            id: 1,
            image_url: null,
            username: 'username',
          }}
        />
      </Stack>
    </>
  );
};
export default FollowedPage;
