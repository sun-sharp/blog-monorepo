import { RouteObject, useRoutes } from 'react-router-dom';
import Home from '@/views/Home';

const routers: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
];

const Router = () => {
  const routes = useRoutes(routers);
  return routes;
};

export { Router };
