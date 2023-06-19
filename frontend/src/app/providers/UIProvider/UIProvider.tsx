import '@/app/styles/global.scss';
import React, { PropsWithChildren, memo } from 'react';
import { NextUIProvider, createTheme, styled } from '@nextui-org/react';
import { HEADING_STYLES } from './headingStyles';

const lightTheme = createTheme({
  type: 'light',
  theme: {},
});

const darkTheme = createTheme({
  type: 'dark',
  theme: {},
});

const UiWrapper = styled('div', {
  '& h1': HEADING_STYLES.h1,
  '& h2': HEADING_STYLES.h2,
  '& h3': HEADING_STYLES.h3,
});

const UIProvider = ({ children }: PropsWithChildren) => {
  return (
    <NextUIProvider theme={darkTheme}>
      <UiWrapper>{children}</UiWrapper>
    </NextUIProvider>
  );
};

export default UIProvider;
