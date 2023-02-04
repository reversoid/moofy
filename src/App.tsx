import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './pages/routes';
import UIProvider from './providers/UIProvider/UIProvider';
import { Suspense } from 'react';
import { useMount } from './shared/hooks/useMount';
import { appStarted } from './models/app/app';

const router = createBrowserRouter(routes);

function App() {
  useMount(appStarted);

  return (
    <UIProvider>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </UIProvider>
  );
}

export default App;
