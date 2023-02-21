import React, { PropsWithChildren, Suspense, memo, useMemo } from 'react';
import { Container, styled } from '@nextui-org/react';
import Header, { HEADER_HEIGHT } from './Header';
import { ErrorSnackBar } from './SnackBar';
import { useSnackbar } from './useSnackBar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

interface LayoutProps {
  disableMaxWidth?: boolean;
}

export const Wrapper = styled(Container, {
  '@xsMax': {
    paddingLeft: '0.5rem !important',
    paddingRight: '0.5rem !important',
  },
});

const Layout = ({ disableMaxWidth }: LayoutProps) => {
  const { errorMessage, handleSnackbarClose, isSnackBarOpen } = useSnackbar();

  const maxWidthStyles = useMemo(() => {
    if (disableMaxWidth) {
      return { maxWidth: '100%', px: 0, pb: 0 };
    }
    return {};
  }, [disableMaxWidth]);

  return (
    <>
      <Header />
      <Wrapper
        lg
        css={{
          paddingBottom: '$12',
          paddingTop: `calc(${HEADER_HEIGHT} + $2)`,
          minHeight: '100%',
          ...maxWidthStyles,
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
