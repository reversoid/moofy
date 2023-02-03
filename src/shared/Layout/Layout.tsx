import React, { PropsWithChildren, memo } from 'react';
import { Container, styled } from '@nextui-org/react';
import Header, { HEADER_HEIGHT } from './Header';
import { ErrorSnackBar } from './SnackBar';
import { useSnackbar } from './useSnackBar';

const Wrapper = styled(Container, {
  pt: HEADER_HEIGHT,
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
      <Wrapper xl>{children}</Wrapper>
      <ErrorSnackBar
        open={isSnackBarOpen}
        message={errorMessage ?? 'Неизвестная ошибка'}
        closeSnackBar={handleSnackbarClose}
      />
    </>
  );
};

export default memo(Layout);
