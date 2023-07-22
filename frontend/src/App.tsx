import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './pages/routes';
import { useMount } from './shared/hooks/useMount';
import UIProvider from './app/providers/UIProvider/UIProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { appStarted } from './app/model';

const router = createBrowserRouter(routes);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

function App() {
  useMount(appStarted);

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        <RouterProvider router={router} />
      </UIProvider>
    </QueryClientProvider>
  );
}

export default App;
