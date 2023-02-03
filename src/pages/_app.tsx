import React from 'react';
import type { AppProps } from 'next/app';
import { NextUIProvider, createTheme } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { withEffector } from 'nextjs-effector';
import Layout from '@/shared/Layout/Layout';
import '@/styles/global.scss';
import { AuthProvider } from '@/contexts/Auth';

const lightTheme = createTheme({
  type: 'light',
  theme: {},
});

const darkTheme = createTheme({
  type: 'dark',
  theme: {},
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <NextThemesProvider
      defaultTheme="dark"
      attribute="class"
      value={{
        light: lightTheme.className,
        dark: darkTheme.className,
      }}
    >
      <NextUIProvider>
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </NextUIProvider>
    </NextThemesProvider>
  );
};

export default withEffector(App);
