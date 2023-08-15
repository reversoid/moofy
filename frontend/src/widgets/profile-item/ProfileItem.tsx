import { ProfileCard } from '@/entities/profile-card/ProfileCard';
import { ProfileShort } from '@/shared/api/types/profile.type';
import React, { FC } from 'react';
import { FollowUnfollowButton } from '../../features/follow/ui/FollowUnfollowButton';
import { useAuth } from '@/app';

export interface ProfileItemProps {
  profile: ProfileShort;
}

export const ProfileItem: FC<ProfileItemProps> = ({ profile }) => {
  const { userId: currentUserId } = useAuth();

  return (
    <ProfileCard
      profile={profile}
      button={
        currentUserId !== profile.id ? <FollowUnfollowButton
          isSubsribed={profile.additionalInfo.isSubscribed}
          userId={profile.id}
        /> : undefined
      }
    ></ProfileCard>
  );
};
