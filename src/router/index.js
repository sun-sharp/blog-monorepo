import React from 'react';
import Loadable from 'react-loadable';

const loadingComponent = ({ error, pastDelay }) => {
  if (error) {
    return <div>Error!</div>;
  } else if (pastDelay) {
    // return <div>Loading...</div>;
    return <div />;
  } else {
    return null;
  }
};

let config = [
  // 首页
  {
    name: 'home',
    path: '/',
    exact: true,
    component: Loadable({
      loader: () => import('../page/home/home.js'),
      loading: loadingComponent,
      delay: 300,
    }),
  },
  {
    name: 'classify',
    path: '/classify',
    exact: true,
    component: Loadable({
      loader: () => import('../page/classify/classify.js'),
      loading: loadingComponent,
      delay: 300,
    }),
  },
  // 文章详情
  {
    name: 'articleDetails',
    path: '/articleDetails',
    exact: true,
    component: Loadable({
      loader: () => import('../page/articleDetails/articleDetails.js'),
      loading: loadingComponent,
      delay: 300,
    }),
  },
  // 官网和后台管理系统切换页面
  {
    name: 'middle',
    path: '/middle',
    exact: true,
    component: Loadable({
      loader: () => import('../page/middle/middle.js'),
      loading: loadingComponent,
      delay: 300,
    }),
  },
];

export default config;
