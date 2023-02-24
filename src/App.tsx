import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './pages/routes';
import UIProvider from './providers/UIProvider/UIProvider';
import { Suspense, memo, useEffect } from 'react';
import { appStarted } from './models/app/app';

const router = createBrowserRouter(routes);

function App() {
  useEffect(appStarted, []);

  return (
    <UIProvider>
      <RouterProvider router={router} />
    </UIProvider>
  );
}

export default App;
