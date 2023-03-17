import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './pages/routes';
import { appStarted } from './models/app/app';
import { useMount } from './shared/hooks/useMount';
import UIProvider from './app/providers/UIProvider/UIProvider';

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
