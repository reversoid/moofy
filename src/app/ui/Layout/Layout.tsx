import { Suspense, memo, useEffect, useMemo } from 'react';
import { Container, styled } from '@nextui-org/react';
import Header, { HEADER_HEIGHT } from './Header';
import { ErrorSnackBar } from './SnackBar';
import { useSnackbar } from './useSnackBar';
import { Outlet, useLocation } from 'react-router-dom';
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

export const ScrollToTop = memo(() => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
});

export const Layout = ({ disableMaxWidth }: LayoutProps) => {
  const { errorMessage, handleSnackbarClose, isSnackBarOpen } = useSnackbar();

  const maxWidthStyles = useMemo(() => {
    if (disableMaxWidth) {
      return { maxWidth: '100%', px: 0, pb: 0, minHeight: 'auto' };
    }
    return {};
  }, [disableMaxWidth]);

  return (
    <>
      <ScrollToTop />
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
