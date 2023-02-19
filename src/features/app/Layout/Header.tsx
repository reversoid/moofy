import React, { forwardRef, memo } from 'react';
import {
  Button,
  ButtonProps,
  Container,
  Image,
  Loading,
  styled,
} from '@nextui-org/react';
import logo from '@/assets/img/Logo.svg';
import profile from '@/assets/img/user-round.svg';
import { useAuth } from '@/shared/hooks/useAuth';
import { Link } from '@/shared/ui/Link';
import { IconButton } from '@/shared/ui/IconButton';
import ActionsDropdown from '@/shared/ui/ActionsDropdown';
import { useNavigate } from 'react-router-dom';

export const HEADER_HEIGHT = '4.75rem';

const HeaderStyled = styled('header', {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  zIndex: 10,
});

const HeaderContainer = styled(Container, {
  height: HEADER_HEIGHT,
  backdropFilter: 'saturate(180%) blur(10px)',
  boxShadow: 'rgb(2 1 1 / 10%) 0px 5px 20px -5px',
  '@xsMax': {
    paddingLeft: '0.5rem !important',
    paddingRight: '0.5rem !important',
  },
});

function Header() {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  return (
    <HeaderStyled>
      <HeaderContainer
        lg
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          to={isLoggedIn ? '/welcome' : ''}
          css={{ height: 'fix-content', width: 'fit-content', dflex: 'center' }}
        >
          <Image
            src={logo}
            height="4rem"
            objectFit="contain"
            width="fit-content"
          />
        </Link>

        {isAuthLoading ? (
          <Loading />
        ) : isLoggedIn === true ? (
          <Link
            to={'/profile'}
            css={{ display: 'block', width: 'fit-content' }}
          >
            <Image
              src={profile}
              height="3rem"
              objectFit="contain"
              width="fit-content"
            />
          </Link>
        ) : isLoggedIn === false ? (
          <Button
            color="gradient"
            css={{ width: '7rem', minWidth: 'auto' }}
            onPress={() => navigate('/auth/register')}
          >
            Войти
          </Button>
        ) : <Loading />}
      </HeaderContainer>
    </HeaderStyled>
  );
}

export default memo(Header);
