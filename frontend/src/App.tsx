import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from './components/Layout';
import { LectureListPage } from './pages/LectureListPage';
import { AddLecturePage } from './pages/AddLecturePage';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Child routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LectureListPage,
});

const addRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add',
  component: AddLecturePage,
});

const routeTree = rootRoute.addChildren([indexRoute, addRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
