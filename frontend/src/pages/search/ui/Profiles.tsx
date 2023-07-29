import { FC } from 'react';
import { Stack } from './Stack';
import { Text } from '@nextui-org/react';
import { ProfileShortWithDescription } from '@/shared/api/types/profile.type';
import { SearchProfileItem } from './SearchProfileItem';

export interface ProfilesProps {
  profiles?: ProfileShortWithDescription[];
  loading: boolean;
}

export const Profiles: FC<ProfilesProps> = ({ profiles, loading }) => {
  if (!loading && profiles?.length === 0) {
    return <Text as={'p'} color='$neutral'>Пользователи не найдены</Text>
  }

  return (
    <Stack>
      {profiles?.map((profile) => (
        <SearchProfileItem profile={profile} key={profile.id} />
      ))}
    </Stack>
  );
};
