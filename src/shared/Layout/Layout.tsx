import React from 'react';
import { Container, styled } from '@nextui-org/react';
import Header, { HEADER_HEIGHT } from './Header';

const Wrapper = styled(Container, {
  pt: HEADER_HEIGHT,
  '@xs': {
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
  },
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Wrapper xl>{children}</Wrapper>
    </>
  );
};

export default Layout;
