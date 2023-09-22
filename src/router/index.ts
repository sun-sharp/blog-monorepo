import type { App } from 'vue';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { BeginRoute, ErrorPageRoute, LoginRoute, RedirectRoute, SettingRoute } from '@/router/base'; // 重定向和报错路由404，,500，403
import { createRouterGuards } from './router-guards';
import { APP_ENV_CONFIG } from '@/constant';

//普通路由 无需验证权限
export const constantRouter = [
  BeginRoute, // 启动
  LoginRoute, // 登录
  RedirectRoute, // 重定向
  SettingRoute, // 设置页面
  ErrorPageRoute, // 404
];

const router = createRouter({
  history: createWebHistory(APP_ENV_CONFIG.baseUrl),
  routes: constantRouter as RouteRecordRaw[],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export const setupRouter = (app: App) => {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
};

export default router;
