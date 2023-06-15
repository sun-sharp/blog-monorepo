import type { AppRouteRecordRaw } from '/#/router';
import { ErrorComponent, HomeComponent, Layout, RedirectComponent, SettingAccountComponent, SettingPasswordComponent } from './router-component';
import { PageEnum } from '@/constant';

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
export const PageRoute: AppRouteRecordRaw = {
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
  },
  children: [
    {
      path: '/:path(.*)*',
      name: PageEnum.ERROR_CHILD_PAGE_NAME,
      component: ErrorComponent,
      meta: {
        title: PageEnum.ERROR_PAGE_TITLE,
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
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: PageEnum.REDIRECT_CHILD_PAGE_NAME,
      component: RedirectComponent,
      meta: {
        title: PageEnum.REDIRECT_PAGE_TITLE,
      },
    },
  ],
};

// 设置
export const SettingRoute: AppRouteRecordRaw = {
  path: PageEnum.SETTING_PATH,
  name: PageEnum.SETTING_NAME,
  component: Layout,
  meta: {
    title: PageEnum.SETTING_TITLE,
  },
  redirect: PageEnum.SETTING_ACCOUNT_PATH,
  children: [
    {
      path: PageEnum.SETTING_ACCOUNT_PATH,
      name: PageEnum.SETTING_ACCOUNT_NAME,
      meta: {
        title: PageEnum.SETTING_ACCOUNT_TITLE,
      },
      component: SettingAccountComponent,
    },
    {
      path: PageEnum.SETTING_PASSWORD_PATH,
      name: PageEnum.SETTING_PASSWORD_NAME,
      meta: {
        title: PageEnum.SETTING_PASSWORD_TITLE,
      },
      component: SettingPasswordComponent,
    },
  ],
};
