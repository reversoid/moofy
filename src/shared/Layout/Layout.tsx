import React from 'react';
import { Container, styled } from '@nextui-org/react';
import Header, { HEADER_HEIGHT } from './Header';
import Footer from './Footer';

const Wrapper = styled(Container, {
  pt: HEADER_HEIGHT,
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Wrapper xl>{children}</Wrapper>
      <Footer />
    </>
  );
};

export default Layout;
