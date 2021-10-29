import { resultSuccess } from '../_util';

const basic = '/mock-api';
const menusList = [
  {
    _id: '111',
    path: '/result',
    name: 'Result',
    component: 'LAYOUT',
    frameSrc: '',
    title: '结果页面',
    icon: 'CheckCircleOutlined',
    sort: 1,
    parentId: '0',
  },
  {
    _id: '222',
    path: 'success',
    name: 'ResultSuccess',
    component: '/result/success',
    frameSrc: '',
    title: '成功页',
    icon: 'CheckCircleOutlined',
    sort: 1,
    parentId: '111',
  },
  // {
  //   _id: '333',
  //   path: 'fail',
  //   name: 'ResultFail',
  //   component: '/result/fail',
  //   frameSrc: '',
  //   title: '失败页',
  //   icon: 'CheckCircleOutlined',
  //   sort: 2,
  //   parentId: '111',
  // },
  {
    _id: '444',
    path: '/frame',
    name: 'Frame',
    component: 'LAYOUT',
    frameSrc: '',
    title: '外部页面',
    icon: 'DesktopOutline',
    sort: 2,
    parentId: '0',
  },
  {
    _id: '555',
    path: 'docs',
    name: 'FrameDocs',
    component: '',
    frameSrc: 'https://naive-ui-admin-docs.vercel.app',
    title: '项目文档(内嵌)',
    icon: 'DesktopOutline',
    sort: 1,
    parentId: '444',
  },
  {
    _id: '666',
    path: '/external',
    name: 'https://naive-ui-admin-docs.vercel.app',
    component: '',
    frameSrc: '',
    title: '项目文档',
    icon: 'DocumentTextOutline',
    sort: 3,
    parentId: '0',
  },
  {
    _id: '777',
    path: '/about',
    name: 'About',
    component: '/about/index',
    frameSrc: '',
    title: '关于',
    icon: 'DocumentTextOutline',
    sort: 3,
    parentId: '0',
  },
];

/* const menusList = [
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
]; */

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
