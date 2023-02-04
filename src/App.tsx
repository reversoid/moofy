import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './pages/routes';
import UIProvider from './providers/UIProvider';
import { Suspense } from 'react';

const router = createBrowserRouter(routes);

function App() {
  return (
    <UIProvider>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </UIProvider>
  );
}

export default App;
