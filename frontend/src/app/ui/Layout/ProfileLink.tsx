import { Link } from '@/shared/ui/Link/Link';
import { Avatar, Dropdown, Image, Text, styled } from '@nextui-org/react';
import React, { FC } from 'react';
import profile from '@/shared/assets/img/user-round.svg';
import { Icon } from '@/shared/ui/Icon/Icon';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { useAuth } from '@/app/auth';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useLogout } from '@/features/auth';

{
  /* <Link
      to={`/profile/${userId}`}
      css={{
        display: 'flex',
        width: 'fit-content',
        height: '100%',
        ai: 'center',
        jc: 'center',
        '@xsMax': {
          display: 'none',
        },
      }}
    >
      <Image src={profile} height="3rem" objectFit="contain" width="3rem" />
    </Link> */
}

const IconButtonStyled = styled(IconButton, {
  width: '3rem !important',
  height: '3rem !important',
});

const AvatarStyled = styled(Avatar, {
  // padding: 0
});

export const ProfileLink = () => {
  const { profile: profileInfo } = useAuth();
  const navigate = useNavigate();
  const logoutMutation = useLogout()

  const handleDropdownAction = (key: React.Key) => {
    if (key === 'profile') {
      navigate(`/profile/${profileInfo?.id}`)
    }

    if (key === 'logout') {
      logoutMutation.mutate()
    }
  }

  return (
    <Dropdown placement="bottom-right">
      <Dropdown.Trigger>
        {profileInfo?.image_url ? (
          <IconButtonStyled>
            <Image
              width={'3rem'}
              height={'3rem'}
              css={{ borderRadius: '50%' }}
              src={profileInfo.image_url}
            />
          </IconButtonStyled>
        ) : (
          <IconButtonStyled>
            <Icon size="3rem" iconUrl={profile} />
          </IconButtonStyled>
        )}
      </Dropdown.Trigger>
      <Dropdown.Menu onAction={handleDropdownAction}  color="secondary" aria-label="Avatar Actions">
        <Dropdown.Item key="profile" css={{ height: '$18' }}>
          <Text b color="inherit" css={{ d: 'flex' }}>
            Выполнен вход за
          </Text>
          <Text b color="secondary" css={{ d: 'flex' }}>
            {profileInfo?.username}
          </Text>
        </Dropdown.Item>

        <Dropdown.Item key="logout" color="error" withDivider>
          Выйти
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
