import { useAuth } from '@/app/auth';
import { useLogout } from '@/features/auth';
import profile from '@/shared/assets/img/user-round.svg';
import { Icon } from '@/shared/ui/Icon/Icon';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { Dropdown, Image, Text, styled } from '@nextui-org/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const IconButtonStyled = styled(IconButton, {
  width: '3rem !important',
  height: '3rem !important',
});

export const ProfileLink = () => {
  const { profile: profileInfo } = useAuth();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  if (!profileInfo) {
    return null;
  }

  const handleDropdownAction = (key: React.Key) => {
    if (key === 'profile') {
      navigate(`/profile/${profileInfo?.id}`);
    }

    if (key === 'logout') {
      logoutMutation.mutate();
    }
  };

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
      <Dropdown.Menu
        onAction={handleDropdownAction}
        color="secondary"
        aria-label="Avatar Actions"
      >
        <Dropdown.Item key="profile" css={{ height: '$18' }}>
          <Text b color="inherit" css={{ d: 'flex' }}>
            Выполнен вход за
          </Text>
          <Text b size={'$lg'} css={{ d: 'flex' }}>
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
