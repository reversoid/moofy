import { Suspense, memo, useEffect } from 'react';
import { Container, styled } from '@nextui-org/react';
import Header, { HEADER_HEIGHT } from './Header';
import { ErrorSnackbar } from './Snackbar/ErrorSnackbar';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import { NotifySnackbar } from './Snackbar/NotifySnackbar';
import { ScrollToTop } from '@/app/utils/scrollToTop';

interface LayoutProps {
  disableMaxWidth?: boolean;
}

export const Wrapper = styled(Container, {
  '@xsMax': {
    paddingLeft: '0.5rem !important',
    paddingRight: '0.5rem !important',
  },
  flexGrow: 1
});

const AppWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%'
});

export const Layout = ({ disableMaxWidth }: LayoutProps) => {
  const maxWidthStyles = disableMaxWidth
    ? { maxWidth: '100%', px: 0, pb: 0, minHeight: 'auto' }
    : {};

  return (
    <>
      <ScrollToTop />
      <Header />
      <AppWrapper>
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
      </AppWrapper>
      <ErrorSnackbar />
      <NotifySnackbar />
    </>
  );
};

export default Layout;
