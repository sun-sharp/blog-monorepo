import { resultSuccess } from '../_util';

const basic = '/mock-api';

const menusList = [
  {
    path: '/home',
    name: 'Home',
    component: 'LAYOUT',
    redirect: '/home/index',
    meta: {
      // sort: 10,
      isRoot: true,
      icon: 'HomeOutlined',
      // activeMenu: 'home_index',
    },
    children: [
      {
        path: 'index',
        name: 'HomeIndex',
        component: '/home/index',
        meta: {
          title: '首页',
        },
      },
    ],
  },
];

export default [
  {
    url: `${basic}/menus`,
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(menusList);
    },
  },
];
