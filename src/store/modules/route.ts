import { toRaw } from 'vue';
import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { store } from '@/store';
import { constantRouter } from '@/router';
import { capitalApi } from '@/api';
import at from 'await-to-js';
import { routerOneScreen } from '@/utils';
import { HomeRoute, PageRoute } from '@/router/base';

export interface IRouteState {
  menus: RouteRecordRaw[];
  routers: any[];
  addRouters: any[];
  keepAliveComponents: string[];
  isDynamicAddedRoute: boolean;
}

export const useRouteStore = defineStore({
  id: 'app-route',
  state: (): IRouteState => ({
    menus: [],
    routers: constantRouter,
    addRouters: [],
    keepAliveComponents: [],
    // 是否已动态添加路由
    isDynamicAddedRoute: false,
  }),
  getters: {
    getMenus(): RouteRecordRaw[] {
      return this.menus;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    getRouters() {
      return toRaw(this.addRouters);
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    // 设置动态路由
    setRouters(routers: any[]) {
      this.addRouters = routers;
      this.routers = constantRouter.concat(routers);
    },
    setMenus(menus: RouteRecordRaw[]) {
      // 设置动态路由
      this.menus = menus;
    },
    setKeepAliveComponents(compNames: string[]) {
      // 设置需要缓存的组件
      this.keepAliveComponents = compNames;
    },
    // 动态获取权限
    async generateRoutes(userInfo?: any) {
      PageRoute.children = [HomeRoute];
      if (!userInfo) return toRaw([PageRoute]);
      const { roleCode } = userInfo;
      // 动态获取菜单
      const [err, resp] = await at(capitalApi.adminMenus({ roleCode }));
      if (err) return toRaw([PageRoute]);
      const accessedRouters = await routerOneScreen(resp);
      PageRoute.children = [HomeRoute, ...accessedRouters.oneRouteList];
      this.setRouters([PageRoute, ...accessedRouters.routeList]);
      this.setMenus(sortRoute([...accessedRouters.routeList, ...accessedRouters.oneRouteList]));
      return toRaw([PageRoute, ...accessedRouters.routeList]);
    },
  },
});

// 需要在设置之外使用
export function useRouteStoreWidthOut() {
  return useRouteStore(store);
}

// 对菜单进行排序
const sortRoute = (list: any[]) => {
  const routeList = list;
  routeList.sort((a: any, b: any) => (a.meta?.sort || 0) - (b.meta?.sort || 0));
  routeList.forEach((i: any) => {
    const item = i;
    if (item.children && item.children.length > 0) {
      item.children = sortRoute(item.children);
    }
    return item;
  });
  return routeList;
};
