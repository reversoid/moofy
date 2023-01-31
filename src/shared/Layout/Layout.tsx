import React from 'react';
import { Container, styled } from '@nextui-org/react';
import Header, { HEADER_HEIGHT } from './Header';

const Wrapper = styled(Container, {
  pt: HEADER_HEIGHT,
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
