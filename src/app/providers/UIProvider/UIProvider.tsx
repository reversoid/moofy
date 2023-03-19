import '@/app/styles/global.scss';
import React, { PropsWithChildren, memo } from 'react';
import { NextUIProvider, createTheme, styled } from '@nextui-org/react';

const lightTheme = createTheme({
  type: 'light',
  theme: {},
});

const darkTheme = createTheme({
  type: 'dark',
  theme: {},
});

const UiWrapper = styled('div', {
  '@xsMax': {
    '& h1': {
      fontSize: '$4xl',
      mb: '$10',
    },
    '& h2': {
      fontSize: '$3xl',
    },
    '& h3': {
      fontSize: '$2xl',
    }
  },
});

const UIProvider = ({ children }: PropsWithChildren) => {
  return (
    <NextUIProvider theme={darkTheme}>
      <UiWrapper>{children}</UiWrapper>
    </NextUIProvider>
  );
};

export default UIProvider;
