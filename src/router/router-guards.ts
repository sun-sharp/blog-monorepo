import { ACCESS_TOKEN, PageEnum } from '@/constant';
import { useRouteStoreWidthOut, useUserStoreWidthOut } from '@/store';
import { getAppEnvConfig, storage } from '@/utils';
import { Router, RouteRecordRaw } from 'vue-router';
import { ErrorPageRoute } from './base';

const LOGIN_PATH = PageEnum.LOGIN_PATH;

const whitePathList = [LOGIN_PATH]; // 白名单中的重定向

export function createRouterGuards(router: Router) {
  const userStore = useUserStoreWidthOut();
  const routeStore = useRouteStoreWidthOut();
  const appEnvConfig = getAppEnvConfig();
  router.beforeEach(async (to, from, next) => {
    const Loading = window['$loading'] || null;
    Loading && Loading.start();
    if (from.path === LOGIN_PATH && to.name === 'errorPage') {
      next(PageEnum.HOME_PATH);
      return;
    }

    // 可以直接输入白名单
    if (whitePathList.includes(to.path as PageEnum)) {
      // 如果去登录页，那么删除token
      if (to.path === LOGIN_PATH) userStore.setToken('');
      next();
      return;
    }

    const token = storage.get(ACCESS_TOKEN);

    if (!token) {
      // 重定向登录页面
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }

    if (routeStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    // 获取用户信息
    const userInfo = await userStore.GetInfo();

    // 获取用户配置信息
    await userStore.GetConfigInfo();

    // 获取动态路由
    const routes = await routeStore.generateRoutes(userInfo);

    // 动态添加可访问路由表
    routes.forEach((item) => {
      router.addRoute(item as unknown as RouteRecordRaw);
    });

    //添加404
    const isErrorPage = router.getRoutes().findIndex((item) => item.name === ErrorPageRoute.name);
    if (isErrorPage === -1) {
      router.addRoute(ErrorPageRoute as unknown as RouteRecordRaw);
    }

    const redirectPath = (from.query.redirect || to.path) as string;
    const redirect = decodeURIComponent(redirectPath);
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
    routeStore.setDynamicAddedRoute(true);
    next(nextData);
    Loading && Loading.finish();
  });

  router.afterEach((to) => {
    document.title = `${appEnvConfig.title}-${(to?.meta?.title as string) || document.title}`;

    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = routeStore.keepAliveComponents;
    const currentComName: any = to.matched.find((item) => item.name == to.name)?.name;
    if (currentComName && !keepAliveComponents.includes(currentComName) && to.meta?.keepAlive) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName);
    } else if (!to.meta?.keepAlive || to.name == 'Redirect') {
      // 不需要缓存的组件
      const index = routeStore.keepAliveComponents.findIndex((name) => name == currentComName);
      if (index != -1) {
        keepAliveComponents.splice(index, 1);
      }
    }
    routeStore.setKeepAliveComponents(keepAliveComponents);

    const Loading = window['$loading'] || null;
    Loading && Loading.finish();
  });

  router.onError((error) => {
    console.log(error, '路由错误');
  });
}
