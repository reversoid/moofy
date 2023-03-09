import logo from '@/assets/img/Logo.svg';
import profile from '@/assets/img/user-round.svg';
import { useAuth } from '@/shared/hooks/useAuth';
import { Link } from '@/shared/ui/Link';
import { LinearProgress } from '@mui/material';
import {
  Button,
  Container,
  Image,
  Loading,
  Progress,
  styled,
} from '@nextui-org/react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  return (
    <HeaderStyled>
      {/* <Progress color="warning" size="xs" value={68} indeterminated /> */}
      <LinearProgress
        sx={{
          '&.MuiLinearProgress-root': {
            background: 'transparent',
          },
          '& .MuiLinearProgress-bar': {
            background: '#ffd131'
          },
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 202
        }}
      />
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
          to={isLoggedIn ? '/welcome' : ''}
          css={{ height: '100%', width: 'fit-content', dflex: 'center' }}
        >
          <Image src={logo} height="4rem" objectFit="contain" width="8rem" />
        </Link>

        {isAuthLoading ? (
          <Loading />
        ) : isLoggedIn === true ? (
          <Link
            to={'/profile'}
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

export default memo(Header);
