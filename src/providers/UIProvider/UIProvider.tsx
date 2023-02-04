import '@/styles/global.scss';
import React, { PropsWithChildren } from 'react';
import { NextUIProvider, createTheme } from '@nextui-org/react';
import Layout from './Layout/Layout';

const lightTheme = createTheme({
  type: 'light',
  theme: {},
});

const darkTheme = createTheme({
  type: 'dark',
  theme: {},
});

const UIProvider = ({ children }: PropsWithChildren) => {
  return (
    <NextUIProvider theme={darkTheme}>
      <Layout>{children}</Layout>
    </NextUIProvider>
  );
};

export default UIProvider;

