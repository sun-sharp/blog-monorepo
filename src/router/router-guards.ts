import { ACCESS_TOKEN, PageEnum } from '@/constant';
import { useRouteStoreWidthOut, useUserStoreWidthOut } from '@/store';
import { storage } from '@/utils';
import { Router } from 'vue-router';

const LOGIN_PATH = PageEnum.LOGIN_PATH;

const whitePathList = [LOGIN_PATH]; // 白名单中的重定向

export function createRouterGuards(router: Router) {
  const userStore = useUserStoreWidthOut();
  const routeStore = useRouteStoreWidthOut();
  router.beforeEach(async (to, from, next) => {
    const Loading = window['$loading'] || null;
    Loading && Loading.start();
    if (from.path === LOGIN_PATH && to.name === 'errorPage') {
      next(PageEnum.HOME_PATH);
      return;
    }

    // 可以直接输入白名单
    if (whitePathList.includes(to.path as PageEnum)) {
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
    console.log(userInfo);

    next();
    Loading && Loading.finish();
  });

  router.afterEach((to) => {
    document.title = (to?.meta?.title as string) || document.title;

    const Loading = window['$loading'] || null;
    Loading && Loading.finish();
  });

  router.onError((error) => {
    console.log(error, '路由错误');
  });
}
