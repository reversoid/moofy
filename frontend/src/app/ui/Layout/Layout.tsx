import { Suspense } from 'react';
import { Container, styled } from '@nextui-org/react';
import Header from './Header';
import { ErrorSnackbar } from './Snackbar/ErrorSnackbar';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import { NotifySnackbar } from './Snackbar/NotifySnackbar';
import { ScrollToTop } from '@/app/utils/scrollToTop';
import { HEADER_HEIGHT } from '@/app/utils/layoutConstants';
import { useFilmModal } from '@/app/utils/use-film-modal';
import { SharedFilmModal } from './shared-film-modal';

interface LayoutProps {
  fullWidth?: boolean;
}

export const Wrapper = styled(Container, {
  '@xsMax': {
    paddingLeft: '0.5rem !important',
    paddingRight: '0.5rem !important',
  },
  flexGrow: 1,
  paddingTop: `calc(${HEADER_HEIGHT} + $2)`,
  paddingBottom: '$12',
  minHeight: '100%',

  variants: {
    fullWidth: {
      true: {
        maxWidth: '100% !important',
        px: '0 !important',
        pb: '0 !important',
        minHeight: 'auto !important',
      },
    },
  },
});

const AppWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  variants: {
    notFullHeight: {
      true: {
        minHeight: 'auto',
      },
    },
  },
});

export const Layout = ({ fullWidth }: LayoutProps) => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <AppWrapper notFullHeight={fullWidth}>
        <Wrapper lg fullWidth={fullWidth}>
          <Suspense>
            <Outlet />
          </Suspense>
        </Wrapper>
        <Footer />
      </AppWrapper>

      <SharedFilmModal />
      <ErrorSnackbar />
      <NotifySnackbar />
    </>
  );
};

export default Layout;
