import React from 'react';
import { Container, Image, styled } from '@nextui-org/react';
import logo from './img/logo.svg';

export const HEADER_HEIGHT = '4.75rem';

const HeaderStyled = styled('header', {
  position: 'fixed',
  width: '100%',
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

const CenteredImage = styled(Image, {
  position: 'relative',
  top: '50%',
  transform: 'translateY(-50%)',
  margin: 0,
});

function Header() {
  return (
    <HeaderStyled>
      <HeaderContainer lg>
        <CenteredImage
          src={logo}
          height="85%"
          objectFit="contain"
          width="fit-content"
        />
      </HeaderContainer>
    </HeaderStyled>
  );
}

export default Header;
