import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import BaseLayout from '@/layouts/BaseLayout';
import Home from '@/views/Home';
import ErrorLayout from '@/layouts/ErrorLayout';
import NotAuthorized from '@/views/error/403';
import NotFound from '@/views/error/404';
import ServiceError from '@/views/error/500';
import Middle from '@/views/Middle';
import Classify from '@/views/Classify';

const routers: RouteObject[] = [
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/classify',
        element: <Classify />,
      },
    ],
  },
  {
    path: '/middle',
    element: <Middle />,
  },
  {
    element: <ErrorLayout />,
    children: [
      {
        path: '403',
        element: <NotAuthorized />,
      },
      {
        path: '404',
        element: <NotFound />,
      },
      {
        path: '500',
        element: <ServiceError />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={'/404'} />,
  },
];

const Router = () => {
  const routes = useRoutes(routers);
  return routes;
};

export { Router };
