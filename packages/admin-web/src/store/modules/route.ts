import { toRaw } from 'vue';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { RouteState } from '/#/store';
import { ApiUserInfo } from '/#/api/user';
import { capitalApi } from '@/api';
import at from 'await-to-js';
import { constantRouterIcon, formatTrendsMenus, isHttpUrl, routerScreen } from '@/utils';
import { AppRouteRecordRaw } from '/#/router';
import { ApiLevelMenuItem } from '/#/api/capital/menu';
import { ViewsMenu } from '/#/views/menu';
// import { PageRoute } from '@/router/base';

export const useRouteStore = defineStore({
  id: 'app-route',
  state: (): RouteState => ({
    menus: [],
    searchMenus: [],
    addRouters: [],
    keepAliveComponents: [],
    // 是否已动态添加路由
    isDynamicAddedRoute: false,
  }),
  getters: {
    getMenus(): ApiLevelMenuItem[] {
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
    },
    // 设置菜单
    setMenus(menus: ApiLevelMenuItem[]) {
      this.menus = menus;
    },
    // 设置查询列表的菜单
    setSearchMenus(searchMenus: ViewsMenu[]) {
      this.searchMenus = searchMenus;
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
      const searchMenus = resp
        .filter((f) => f.component || f.iframeSrc || isHttpUrl(f.name))
        .map((m) => ({ ...m, icon: m.icon ? constantRouterIcon[m.icon] : null }));
      this.setSearchMenus(searchMenus);
      // 创建菜单
      const formatMenus = formatTrendsMenus(resp);
      this.setMenus(formatMenus);
      // 创建路由
      const accessedRouters = routerScreen(resp);
      this.setRouters(accessedRouters);
      return toRaw(accessedRouters);
    },
  },
});

// 需要在设置之外使用
export function useRouteStoreWidthOut() {
  return useRouteStore(store);
}
