import logo from '@/shared/assets/img/Logo.svg';
import {
  Button,
  Container,
  Image,
  Loading,
  Row,
  Text,
  styled,
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import LinearProgress from './LinearProgress';
import { useStore } from 'effector-react';
import { $loading } from '@/app';
import { Link } from '@/shared/ui/Link/Link';
import { useAuth } from '@/app';
import { Sidenav } from './Sidenav/Sidenav';
import { useState } from 'react';
import { BurgerButton } from './Burger/BurgerButton';
import { ProfileLink } from './ProfileLink';
import { HEADER_HEIGHT } from '@/app/utils/layoutConstants';
import { Icon } from '@/shared/ui/Icon/Icon';
import searchIcon from '@/shared/assets/img/search.svg';

const HeaderStyled = styled('header', {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  zIndex: 1201,
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
  const loading = useStore($loading);
  const [sidenavOpen, setSidenavOpen] = useState(false);

  return (
    <HeaderStyled>
      <Sidenav isOpen={sidenavOpen} setIsOpen={setSidenavOpen} />
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
          <>
            <BurgerButton
              isOpen={sidenavOpen}
              onClick={() => setSidenavOpen((open) => !open)}
            />
            <Row
              css={{
                ai: 'center',
                gap: '$8',
                jc: 'flex-end',
                '@xsMax': { display: 'none' },
              }}
            >
              <Button
                onClick={() => navigate('/search/collections')}
                color={'secondary'}
                css={{ minWidth: '6.5rem', gap: '$4' }}
              >
                <Row css={{ gap: '$4', ai: 'center' }}>
                  <Icon iconUrl={searchIcon} size="1.25rem" />
                  <Text b>Поиск</Text>
                </Row>
              </Button>
              <ProfileLink />
            </Row>
          </>
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
