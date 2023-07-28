import { Link } from '@/shared/ui/Link/Link';
import { Image } from '@nextui-org/react';
import React, { FC } from 'react';
import profile from '@/shared/assets/img/user-round.svg';

interface ProfileLinkProps {
  userId: number;
}

export const ProfileLink: FC<ProfileLinkProps> = ({ userId }) => {
  return (
    <Link
      to={`/profile/${userId}`}
      css={{
        display: 'flex',
        width: 'fit-content',
        height: '100%',
        ai: 'center',
        jc: 'center',
        '@xsMax': {
          display: 'none'
        }
      }}
    >
      <Image src={profile} height="3rem" objectFit="contain" width="3rem" />
    </Link>
  );
};
