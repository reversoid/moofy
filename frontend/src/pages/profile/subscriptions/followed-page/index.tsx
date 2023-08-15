import { Stack } from '@/shared/ui/Stack';
import { ProfileItem } from '@/widgets/profile-item/ProfileItem';
import { Text } from '@nextui-org/react';

export const FollowedPage = () => {
  return (
    <>
      <Text h1>Подписки</Text>
      <Stack>
        <ProfileItem
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
