import React, { PropsWithChildren, Suspense, memo } from 'react';
import { Container, styled } from '@nextui-org/react';
import Header, { HEADER_HEIGHT } from './Header';
import { ErrorSnackBar } from './SnackBar';
import { useSnackbar } from './useSnackBar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

export const Wrapper = styled(Container, {
  '@xsMax': {
    paddingLeft: '0.5rem !important',
    paddingRight: '0.5rem !important',
  },
});

const Layout = ({ children }: PropsWithChildren) => {
  const { errorMessage, handleSnackbarClose, isSnackBarOpen } = useSnackbar();

  return (
    <>
      <Header />
      <Wrapper
        lg
        css={{
          paddingBottom: '$12',
          paddingTop: `calc(${HEADER_HEIGHT} + $2)`,
          minHeight: '100%',
        }}
      >
        <Suspense>
          <Outlet />
        </Suspense>
      </Wrapper>
      <Footer />
      <ErrorSnackBar
        open={isSnackBarOpen}
        message={errorMessage!}
        closeSnackBar={handleSnackbarClose}
      />
    </>
  );
};

export default memo(Layout);
