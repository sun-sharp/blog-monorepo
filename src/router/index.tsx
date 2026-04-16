import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import BaseLayout from '@/layouts/BaseLayout';
import Home from '@/views/Home';
import ErrorLayout from '@/layouts/ErrorLayout';
import NotAuthorized from '@/views/Error/403';
import NotFound from '@/views/Error/404';
import ServiceError from '@/views/Error/500';
import Middle from '@/views/Middle';
import Classify from '@/views/Classify';
import ArticleDetails from '@/views/ArticleDetails';

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
      {
        path: '/articleDetails/:articleId',
        element: <ArticleDetails />,
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
