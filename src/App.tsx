import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './pages/routes';
import UIProvider from './providers/UIProvider/UIProvider';
import { appStarted } from './models/app/app';
import { useMount } from './shared/hooks/useMount';

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
