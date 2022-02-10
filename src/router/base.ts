import type { AppRouteRecordRaw } from '@/router/types';
import { ErrorPage, RedirectName, Layout } from '@/router/constant';
import { PageEnum } from '@/enums';
import { RouteRecordRaw } from 'vue-router';

// 首页
export const HomeRoute: AppRouteRecordRaw = {
  path: 'home',
  name: `Home`,
  component: () => import('@/views/home/index.vue'),
  meta: {
    title: '首页',
  },
};

// 一级菜单
export const PageRoute: RouteRecordRaw = {
  path: '/',
  redirect: PageEnum.HOME_PATH,
  component: Layout,
  children: [],
};

// 404 on a page
export const ErrorPageRoute: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: Layout,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: 'ErrorPageSon',
      component: ErrorPage,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
      },
    },
  ],
};

// 重定向
export const RedirectRoute: AppRouteRecordRaw = {
  path: '/redirect',
  name: RedirectName,
  component: Layout,
  meta: {
    title: RedirectName,
    hideBreadcrumb: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: RedirectName,
      component: () => import('@/views/redirect/index.vue'),
      meta: {
        title: RedirectName,
        hideBreadcrumb: true,
      },
    },
  ],
};
