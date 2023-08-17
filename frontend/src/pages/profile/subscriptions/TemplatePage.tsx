import { ProfileShort } from '@/shared/api/types/profile.type';
import LoadMore from '@/shared/components/LoadMore';
import { Stack } from '@/shared/ui/Stack';
import { ProfileItem } from '@/widgets/profile-item/ProfileItem';
import { Text } from '@nextui-org/react';
import { FC } from 'react';

interface SubscriptionsTemplatePage {
  title: string;
  loadMore: () => void;
  loadingMore: boolean;
  canLoadMore: boolean;
  profiles?: ProfileShort[];
}

export const SubscriptionsTemplatePage: FC<SubscriptionsTemplatePage> = ({
  loadMore,
  loadingMore,
  title,
  canLoadMore,
  profiles,
}) => {
  return (
    <>
      <Text h1>{title}</Text>
      <Stack>
        {profiles?.length === 0 && <Text color="$neutral">Список пуст</Text>}
        {profiles?.map((profile) => (
          <ProfileItem
            profile={{
              additionalInfo: {
                isSubscribed: profile.additionalInfo.isSubscribed,
              },
              description: profile.description,
              id: profile.id,
              image_url: profile.image_url,
              username: profile.username,
            }}
            key={profile.id}
          />
        ))}
      </Stack>

      {canLoadMore && <LoadMore loading={loadingMore} loadMore={loadMore} />}
    </>
  );
};
