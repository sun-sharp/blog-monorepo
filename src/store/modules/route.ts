import { toRaw } from 'vue';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { RouteState } from '/#/store';
import { ApiUserInfo } from '/#/api/user';
// import { constantRouter } from '@/router';
import { capitalApi } from '@/api';
import at from 'await-to-js';
import { constantRouterIcon, routerScreen, sortRouteMenu } from '@/utils';
import { AppRouteRecordRaw } from '/#/router';
import { ApiMenuItem } from '/#/api/menu';
import { ViewsMenu } from '/#/views/menu';
import { HomeRoute, PageRoute } from '@/router/base';

export const useRouteStore = defineStore({
  id: 'app-route',
  state: (): RouteState => ({
    menus: [],
    searchMenus: [],
    // routers: constantRouter,
    addRouters: [],
    keepAliveComponents: [],
    // 是否已动态添加路由
    isDynamicAddedRoute: false,
  }),
  getters: {
    getMenus(): AppRouteRecordRaw[] {
      return this.menus;
    },
    getSearchMenus(): ViewsMenu[] {
      return this.searchMenus;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    // 设置动态路由
    setRouters(routers: AppRouteRecordRaw[]) {
      this.addRouters = routers;
      // this.routers = constantRouter.concat(routers);
    },
    setMenus(menus: AppRouteRecordRaw[]) {
      // 设置动态路由
      this.menus = menus;
    },
    // 设置查询列表的菜单
    setSearchMenus(searchMenus: ApiMenuItem[]) {
      this.searchMenus = searchMenus.filter((f) => f.component !== 'layout').map((m) => ({ ...m, icon: constantRouterIcon[m.icon] }));
    },
    setKeepAliveComponents(compNames: string[]) {
      // 设置需要缓存的组件
      this.keepAliveComponents = compNames;
    },
    // 动态获取权限
    async generateRoutes(userInfo?: ApiUserInfo) {
      if (!userInfo) return toRaw([]);
      const { roleCode } = userInfo;
      // 动态获取菜单
      const [err, resp] = await at(capitalApi.adminMenus(roleCode));
      if (err) return toRaw([]);
      // 设置菜单搜索
      this.setSearchMenus(resp);
      const accessedRouters = routerScreen(resp);
      PageRoute.children = accessedRouters;
      const routers = [PageRoute];
      this.setRouters(routers);
      this.setMenus([HomeRoute, ...sortRouteMenu(accessedRouters)]);
      return toRaw(routers);
    },
  },
});

// 需要在设置之外使用
export function useRouteStoreWidthOut() {
  return useRouteStore(store);
}
