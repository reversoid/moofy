import React, { PropsWithChildren } from 'react';
import { Container, styled } from '@nextui-org/react';
import Header, { HEADER_HEIGHT } from './Header';

const Wrapper = styled(Container, {
  pt: HEADER_HEIGHT,
  '@xsMax': {
    paddingLeft: '0.5rem !important',
    paddingRight: '0.5rem !important',
  },
});

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <Wrapper xl>{children}</Wrapper>
    </>
  );
};

export default Layout;
