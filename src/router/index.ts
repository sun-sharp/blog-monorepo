import { getAppEnvConfig } from '@/utils';
import type { App } from 'vue';
import {
  createRouter,
  createWebHistory,
  // createWebHashHistory,
  RouteRecordRaw,
} from 'vue-router';

export const PageRoute: RouteRecordRaw = {
  path: '/',
  redirect: '/login',
};

// 登录页
export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/login-index.vue'),
  meta: {
    title: '登录',
  },
};

//普通路由 无需验证权限
export const constantRouter: any[] = [PageRoute, LoginRoute];

const router = createRouter({
  // history: createWebHistory(''),
  history: createWebHistory(getAppEnvConfig().baseUrl),
  routes: constantRouter,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
  app.use(router);
}

export default router;
