import type { AppRouteRecordRaw } from '/#/router';
import { ErrorComponent, HomeComponent, Layout, PageEnum, RedirectComponent } from '@/constant';
import { RouteRecordRaw } from 'vue-router';

// 首页
export const HomeRoute: AppRouteRecordRaw = {
  path: PageEnum.HOME_PATH,
  name: PageEnum.HOME_NAME,
  component: HomeComponent,
  meta: {
    title: PageEnum.HOME_TITLE,
  },
};

// 一级菜单
export const PageRoute: RouteRecordRaw = {
  path: '/',
  redirect: PageEnum.HOME_PATH,
  component: Layout,
  children: [HomeRoute],
};

// 404 on a page
export const ErrorPageRoute: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PageEnum.ERROR_PAGE_NAME,
  component: Layout,
  meta: {
    title: PageEnum.ERROR_PAGE_TITLE,
    hideBreadcrumb: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: PageEnum.ERROR_CHILD_PAGE_NAME,
      component: ErrorComponent,
      meta: {
        title: PageEnum.ERROR_PAGE_TITLE,
        hideBreadcrumb: true,
      },
    },
  ],
};

// 重定向
export const RedirectRoute: AppRouteRecordRaw = {
  path: '/redirect',
  name: PageEnum.REDIRECT_PAGE_NAME,
  component: Layout,
  meta: {
    title: PageEnum.REDIRECT_PAGE_TITLE,
    hideBreadcrumb: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: PageEnum.REDIRECT_CHILD_PAGE_NAME,
      component: RedirectComponent,
      meta: {
        title: PageEnum.REDIRECT_PAGE_TITLE,
        hideBreadcrumb: true,
      },
    },
  ],
};
