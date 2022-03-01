import type { App } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { getAppEnvConfig } from '@/utils';
import { PageRoute } from '@/router/base'; // 重定向和报错路由404，,500，403
import { createRouterGuards } from './router-guards';

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
  history: createWebHistory(getAppEnvConfig().baseUrl),
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
