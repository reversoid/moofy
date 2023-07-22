import logo from '@/shared/assets/img/Logo.svg';
import profile from '@/shared/assets/img/user-round.svg';
import { Button, Container, Image, Loading, styled } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import LinearProgress from './LinearProgress';
import { useStore } from 'effector-react';
import { $loading } from '@/app';
import { Link } from '@/shared/ui/Link/Link';
import { useAuth } from '@/app';

export const HEADER_HEIGHT = '4.75rem';

const HeaderStyled = styled('header', {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  zIndex: 201,
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
  const { isLoggedIn, isLoading: isAuthLoading, userId } = useAuth();
  const navigate = useNavigate();
  const loading = useStore($loading);

  return (
    <HeaderStyled>
      <LinearProgress loading={loading} />
      <HeaderContainer
        lg
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
        }}
      >
        <Link
          to={isLoggedIn ? '/welcome/collections' : ''}
          css={{ height: '100%', width: 'fit-content', dflex: 'center' }}
        >
          <Image src={logo} height="4rem" objectFit="contain" width="8rem" />
        </Link>

        {isAuthLoading ? (
          <Loading />
        ) : isLoggedIn === true ? (
          <Link
            to={`/profile/${userId}`}
            css={{
              display: 'flex',
              width: 'fit-content',
              height: '100%',
              ai: 'center',
              jc: 'center',
            }}
          >
            <Image
              src={profile}
              height="3rem"
              objectFit="contain"
              width="3rem"
            />
          </Link>
        ) : isLoggedIn === false ? (
          <Button
            color="gradient"
            css={{ width: '7rem', minWidth: 'auto' }}
            onPress={() => navigate('/auth/register')}
          >
            Регистрация
          </Button>
        ) : (
          <Loading />
        )}
      </HeaderContainer>
    </HeaderStyled>
  );
}

export default Header;
