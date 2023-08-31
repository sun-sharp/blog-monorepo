import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { getAppEnvConfig } from '@/utils';
import { LoginRoute } from '@/router/base'; // 重定向和报错路由404，,500，403
// import { createRouterGuards } from './router-guards';

//普通路由 无需验证权限
export const constantRouter: any[] = [
  LoginRoute, // 登录
  // RedirectRoute, // 重定向
  // SettingRoute, // 设置页面
  // ErrorPageRoute, // 404
];

const router = createRouter({
  history: createWebHistory(getAppEnvConfig().baseUrl),
  routes: constantRouter,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  // createRouterGuards(router);
}

export default router;
