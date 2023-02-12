import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './pages/routes';
import UIProvider from './providers/UIProvider/UIProvider';
import { Suspense, memo } from 'react';
import { useMount } from './shared/hooks/useMount';
import { appStarted } from './models/app/app';

const router = createBrowserRouter(routes);

function App() {
  useMount(appStarted);

  return (
    <UIProvider>
      <RouterProvider router={router} />
    </UIProvider>
  );
}

export default App;
