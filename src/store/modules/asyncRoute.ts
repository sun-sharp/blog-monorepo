import { toRaw } from 'vue';
import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { store } from '@/store';
import { constantRouter } from '@/router/index';
import { generatorDynamicRouter } from '@/router/generator-routers';
import { HomeRoute, PageRoute } from '@/router/base';

export interface IAsyncRouteState {
  menus: RouteRecordRaw[];
  routers: any[];
  addRouters: any[];
  keepAliveComponents: string[];
  isDynamicAddedRoute: boolean;
}

export const useAsyncRouteStore = defineStore({
  id: 'app-async-route',
  state: (): IAsyncRouteState => ({
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
    setRouters(routers) {
      this.addRouters = routers;
      this.routers = constantRouter.concat(routers);
    },
    setMenus(menus) {
      // 设置动态路由
      this.menus = menus;
    },
    setKeepAliveComponents(compNames) {
      // 设置需要缓存的组件
      this.keepAliveComponents = compNames;
    },
    // 动态获取权限
    async generateRoutes(userInfo?) {
      let accessedRouters;
      // 动态获取菜单
      try {
        accessedRouters = await generatorDynamicRouter(userInfo.grade);
      } catch (error) {
        console.log(error);
      }
      PageRoute.children = [HomeRoute, ...accessedRouters.oneRouteList];
      this.setRouters([PageRoute, ...accessedRouters.routeList]);
      this.setMenus(sortRoute([...accessedRouters.routeList, ...accessedRouters.oneRouteList]));
      return toRaw([PageRoute, ...accessedRouters.routeList]);
    },
  },
});

// 需要在设置之外使用
export function useAsyncRouteStoreWidthOut() {
  return useAsyncRouteStore(store);
}

// 对菜单进行排序
const sortRoute = (list) => {
  const routeList = list;
  routeList.sort((a, b) => (a.meta?.sort || 0) - (b.meta?.sort || 0));
  routeList.forEach((i) => {
    const item = i;
    if (item.children && item.children.length > 0) {
      item.children = sortRoute(item.children);
    }
    return item;
  });
  return routeList;
};
