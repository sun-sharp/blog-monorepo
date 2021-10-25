import { App } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// import { createRouterGuards } from './router-guards';


// export const RootRoute: RouteRecordRaw = {
//   path: '/',
//   name: 'Root',
//   redirect: PageEnum.BASE_HOME,
//   meta: {
//     title: 'Root',
//   },
// };

// 登录页
export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/index.vue'),
  meta: {
    title: '登录',
  },
};


//普通路由 无需验证权限
export const constantRouter: any[] = [LoginRoute];

const router = createRouter({
  history: createWebHistory(''),
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