import { FC } from 'react';
import { Text } from '@nextui-org/react';
import { ProfileShort } from '@/shared/api/types/profile.type';
import { Stack } from '@/shared/ui/Stack';
import { ProfileItem } from '@/widgets/profile-item/ProfileItem';

export interface ProfilesProps {
  profiles?: ProfileShort[];
  loading: boolean;
}

export const Profiles: FC<ProfilesProps> = ({ profiles, loading }) => {
  if (!loading && profiles?.length === 0) {
    return (
      <Stack css={{ mt: '$12' }}>
        <Text as={'p'} color="$neutral">
          Пользователи не найдены
        </Text>
      </Stack>
    );
  }

  return (
    <Stack css={{ mt: '$12' }}>
      {profiles?.map((profile) => (
        <ProfileItem profile={profile} key={profile.id} />
      ))}
    </Stack>
  );
};
