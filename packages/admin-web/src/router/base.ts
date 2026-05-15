import type { AppRouteRecordRaw } from '/#/router';
import {
  Error404Component,
  HomeComponent,
  Layout,
  LoginComponent,
  RedirectComponent,
  SettingAccountComponent,
  SettingPasswordComponent,
} from './router-component';
import { PAGE_ENUM } from '@/constant';
import { constantRouterIcon } from '@/utils';

// 登录页
export const LoginRoute: AppRouteRecordRaw = {
  path: PAGE_ENUM.LOGIN_PATH,
  name: PAGE_ENUM.LOGIN_NAME,
  component: LoginComponent,
  meta: {
    title: PAGE_ENUM.LOGIN_TITLE,
  },
};

// 首页
export const HomeRoute: AppRouteRecordRaw = {
  path: PAGE_ENUM.HOME_PATH,
  name: PAGE_ENUM.HOME_NAME,
  component: HomeComponent,
  meta: {
    title: PAGE_ENUM.HOME_TITLE,
    icon: constantRouterIcon[PAGE_ENUM.HOME_ICON],
  },
};

// 开始菜单
export const BeginRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Begin',
  redirect: PAGE_ENUM.HOME_PATH,
  component: Layout,
  children: [HomeRoute],
};

// 一级菜单
export const PageRoute: AppRouteRecordRaw = {
  path: PAGE_ENUM.PAGE_PATH,
  name: PAGE_ENUM.PAGE_NAME,
  redirect: PAGE_ENUM.HOME_PATH,
  component: Layout,
  children: [],
};

// 404 on a page
export const ErrorPageRoute: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_ENUM.ERROR_PAGE_NAME,
  component: Layout,
  meta: {
    title: PAGE_ENUM.ERROR_PAGE_TITLE,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: PAGE_ENUM.ERROR_CHILD_PAGE_NAME,
      component: Error404Component,
      meta: {
        title: PAGE_ENUM.ERROR_PAGE_TITLE,
      },
    },
  ],
};

// 重定向
export const RedirectRoute: AppRouteRecordRaw = {
  path: PAGE_ENUM.REDIRECT_PATH,
  name: PAGE_ENUM.REDIRECT_PAGE_NAME,
  component: Layout,
  meta: {
    title: PAGE_ENUM.REDIRECT_PAGE_TITLE,
  },
  children: [
    {
      path: `${PAGE_ENUM.REDIRECT_PATH}/:path(.*)`,
      name: PAGE_ENUM.REDIRECT_CHILD_PAGE_NAME,
      component: RedirectComponent,
      meta: {
        title: PAGE_ENUM.REDIRECT_PAGE_TITLE,
      },
    },
  ],
};

// 设置
export const SettingRoute: AppRouteRecordRaw = {
  path: PAGE_ENUM.SETTING_PATH,
  name: PAGE_ENUM.SETTING_NAME,
  component: Layout,
  meta: {
    title: PAGE_ENUM.SETTING_TITLE,
  },
  redirect: PAGE_ENUM.SETTING_ACCOUNT_PATH,
  children: [
    {
      path: PAGE_ENUM.SETTING_ACCOUNT_PATH,
      name: PAGE_ENUM.SETTING_ACCOUNT_NAME,
      meta: {
        title: PAGE_ENUM.SETTING_ACCOUNT_TITLE,
      },
      component: SettingAccountComponent,
    },
    {
      path: PAGE_ENUM.SETTING_PASSWORD_PATH,
      name: PAGE_ENUM.SETTING_PASSWORD_NAME,
      meta: {
        title: PAGE_ENUM.SETTING_PASSWORD_TITLE,
      },
      component: SettingPasswordComponent,
    },
  ],
};
