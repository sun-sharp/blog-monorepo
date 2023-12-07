import { ACCESS_TOKEN, APP_ENV_CONFIG, PAGE_ENUM } from '@/constant';
import { useLockScreenStoreWidthOut, useRouteStoreWidthOut, useUserStoreWidthOut } from '@/store';
import { storage } from '@/utils';
import { RouteRecordRaw, Router } from 'vue-router';

const LOGIN_PATH = PAGE_ENUM.LOGIN_PATH;

const win: WindowConfig = window;

const whitePathList = [LOGIN_PATH]; // 白名单中的重定向

export function createRouterGuards(router: Router) {
  const userStore = useUserStoreWidthOut();
  const routeStore = useRouteStoreWidthOut();
  const useLockScreen = useLockScreenStoreWidthOut();
  router.beforeEach(async (to, from, next) => {
    const Loading = win['$loading'] || null;
    Loading && Loading.start();
    if (from.path === LOGIN_PATH && (to.name === PAGE_ENUM.ERROR_PAGE_NAME || to.name === PAGE_ENUM.ERROR_CHILD_PAGE_NAME)) {
      next(PAGE_ENUM.HOME_PATH);
      return;
    }
    // 可以直接输入白名单
    if (whitePathList.includes(to.path)) {
      // 如果去登录页，那么删除token
      if (to.path === LOGIN_PATH) {
        userStore.logout();
        useLockScreen.setLock(false);
      }
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

    // 获取用户信息和动态路由
    if (!routeStore.getIsDynamicAddedRoute) {
      // 获取用户信息
      const userInfo = await userStore.GetInfo();

      // 获取用户配置信息
      await userStore.GetConfigInfo();
      // 获取动态路由
      const routes = await routeStore.generateRoutes(userInfo);
      // 动态添加可访问路由表
      routes.forEach((item) => {
        router.addRoute(item as RouteRecordRaw);
      });
      routeStore.setDynamicAddedRoute(true);
      // 跳转重定向地址
      const redirectPath = (from.query.redirect || to.path) as string;
      const redirect = decodeURIComponent(redirectPath);
      const nextData = to.path === redirect ? { path: to.path, replace: true } : { path: redirect };
      next(nextData);
      return;
    }
    next();
  });

  router.afterEach((to) => {
    document.title = `${APP_ENV_CONFIG.title}-${to?.meta?.title as string}` || document.title;
    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = routeStore.keepAliveComponents;
    const currentComName = to.matched.find((item) => item.name == to.name)?.name as string;
    if (currentComName && !keepAliveComponents.includes(currentComName) && to.meta?.keepAlive) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName);
    } else if (!to.meta?.keepAlive || to.name === PAGE_ENUM.REDIRECT_NAME || to.name === PAGE_ENUM.REDIRECT_CHILD_PAGE_NAME) {
      // 不需要缓存的组件
      const index = routeStore.keepAliveComponents.findIndex((name) => name == currentComName);
      if (index != -1) {
        keepAliveComponents.splice(index, 1);
      }
    }
    routeStore.setKeepAliveComponents(keepAliveComponents);
    const Loading = win['$loading'] || null;
    Loading && Loading.finish();
  });

  router.onError((error) => {
    console.log(error, '路由错误');
  });
}
