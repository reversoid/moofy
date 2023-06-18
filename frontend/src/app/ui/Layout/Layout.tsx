import { Suspense, memo, useEffect } from 'react';
import { Container, styled } from '@nextui-org/react';
import Header, { HEADER_HEIGHT } from './Header';
import { ErrorSnackbar } from './Snackbar/ErrorSnackbar';
import { useErrorSnackbar } from './useErrorSnackbar';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import { useNotifySnackbar } from './useNotifySnackbar';
import { NotifySnackbar } from './Snackbar/NotifySnackbar';

interface LayoutProps {
  disableMaxWidth?: boolean;
}

export const Wrapper = styled(Container, {
  '@xsMax': {
    paddingLeft: '0.5rem !important',
    paddingRight: '0.5rem !important',
  },
});

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const Layout = ({ disableMaxWidth }: LayoutProps) => {
  // TODO use components to encapsulate logic about snackbars
  const {
    errorMessage,
    handleSnackbarClose: handleErrorSnackbarClose,
    isSnackbarOpen: isErrorSnackbarOpen,
  } = useErrorSnackbar();

  const {
    handleSnackbarClose: handleNotifySnackbarClose,
    isSnackbarOpen: isNotifySnackbarOpen,
    notifyMessage,
  } = useNotifySnackbar();

  const maxWidthStyles = disableMaxWidth
    ? { maxWidth: '100%', px: 0, pb: 0, minHeight: 'auto' }
    : {};

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
      <ErrorSnackbar
        open={isErrorSnackbarOpen}
        message={errorMessage!}
        closeSnackBar={handleErrorSnackbarClose}
      />
      <NotifySnackbar
        closeSnackBar={handleNotifySnackbarClose}
        message={notifyMessage!}
        open={isNotifySnackbarOpen}
      />
    </>
  );
};

export default Layout;
