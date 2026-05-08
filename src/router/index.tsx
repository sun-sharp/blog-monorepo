import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import { KeepAlive } from 'react-activation';
import BaseLayout from '@/layouts/BaseLayout';
import Home from '@/views/Home';
import ErrorLayout from '@/layouts/ErrorLayout';
import NotAuthorized from '@/views/error/403';
import NotFound from '@/views/error/404';
import ServiceError from '@/views/error/500';
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
        element: (
          <KeepAlive name="Home">
            <Home />
          </KeepAlive>
        ),
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
  return useRoutes(routers);
};

export { Router };
