import { ProfileShort } from '@/shared/api/types/profile.type';
import LoadMore from '@/shared/components/LoadMore';
import { SearchInput } from '@/shared/components/SearchInput';
import { Stack } from '@/shared/ui/Stack';
import { ProfileItem } from '@/widgets/profile-item';
import { Text } from '@nextui-org/react';
import { FC } from 'react';

interface SubscriptionsTemplatePage {
  title: string;
  loadMore: () => void;
  loadingMore: boolean;
  canLoadMore: boolean;
  profiles?: ProfileShort[];
  setSearch?: (search: string) => void;
}

export const SubscriptionsTemplatePage: FC<SubscriptionsTemplatePage> = ({
  loadMore,
  loadingMore,
  title,
  canLoadMore,
  profiles,
  setSearch,
}) => {
  return (
    <>
      <Text h1>{title}</Text>
      <SearchInput debouncedOnChange={setSearch} />
      <Stack css={{ mt: '$8' }}>
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
