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
      // isRoot: true,
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
  {
    path: '/result',
    name: 'Result',
    redirect: '/result/success',
    component: 'LAYOUT',
    meta: {
      title: '结果页面',
      icon: 'CheckCircleOutlined',
      sort: 4,
    },
    children: [
      {
        path: 'success',
        name: 'result-success',
        meta: {
          title: '成功页',
          icon: 'CheckCircleOutlined',
        },
        component: '/result/success',
      },
      {
        path: 'fail',
        name: 'result-fail',
        meta: {
          title: '失败页',
          icon: 'CheckCircleOutlined',
        },
        component: '/result/fail',
      },
      {
        path: 'info',
        name: 'result-info',
        meta: {
          title: '信息页',
          icon: 'CheckCircleOutlined',
        },
        component: '/result/info',
      },
    ],
  },
  {
    path: '/frame',
    name: 'Frame',
    redirect: '/frame/docs',
    component: 'LAYOUT',
    meta: {
      title: '外部页面',
      sort: 8,
      icon: 'DesktopOutline',
    },
    children: [
      {
        path: 'docs',
        name: 'frame-docs',
        meta: {
          title: '项目文档(内嵌)',
          frameSrc: 'https://naive-ui-admin-docs.vercel.app',
        },
      },
      {
        path: 'naive',
        name: 'frame-naive',
        meta: {
          title: 'NaiveUi(内嵌)',
          frameSrc: 'https://www.naiveui.com',
        },
      },
    ],
  },
  {
    path: '/external',
    name: 'https://naive-ui-admin-docs.vercel.app',
    component: 'LAYOUT',
    meta: {
      title: '项目文档',
      icon: 'DocumentTextOutline',
      sort: 9,
    },
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
