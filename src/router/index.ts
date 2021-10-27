import type { App } from 'vue';
import {
  createRouter, // createWebHistory,
  createWebHashHistory,
  RouteRecordRaw,
} from 'vue-router';
import { RedirectRoute } from '@/router/base'; // 重定向和报错路由404，,500，403
import { PageEnum } from '@/enums/pageEnum';
import { createRouterGuards } from './router-guards';

// 获取静态路由
const modules = import.meta.globEager('./modules/**/*.ts');

const routeModuleList: RouteRecordRaw[] = [];

// 循环路由
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

// 按照路由排序规则排序
function sortRoute(a, b) {
  return (a.meta?.sort || 0) - (b.meta?.sort || 0);
}
routeModuleList.sort(sortRoute);

// 首页
export const RootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

// 登录页
export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/index.vue'),
  meta: {
    title: '登录',
  },
};

//需要验证权限
export const asyncRoutes = [...routeModuleList];

//普通路由 无需验证权限
export const constantRouter: any[] = [LoginRoute, RootRoute, RedirectRoute];

const router = createRouter({
  history: createWebHashHistory(''),
  // history: createWebHistory('/'),
  routes: constantRouter,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
}

export default router;
