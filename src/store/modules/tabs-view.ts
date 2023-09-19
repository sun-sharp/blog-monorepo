import { PAGE_ENUM } from '@/constant';
import { defineStore } from 'pinia';
import { TabsViewState } from '/#/store';
import { RouteItem } from '/#/router';

// 不需要出现在标签页中的路由
const whiteList = [PAGE_ENUM.ERROR_PAGE_NAME, PAGE_ENUM.REDIRECT_CHILD_PAGE_NAME, PAGE_ENUM.LOGIN_NAME];

export const useTabsViewStore = defineStore({
  id: 'app-tabs-view',
  state: (): TabsViewState => ({
    tabsList: [],
  }),
  getters: {},
  actions: {
    initTabs(routes: RouteItem[]) {
      // 初始化标签页
      this.tabsList = routes;
    },
    addTabs(route: RouteItem): boolean {
      // 添加标签页
      if (whiteList.includes(route.name)) return false;
      const isExists = this.tabsList.some((item) => item.fullPath == route.fullPath);
      if (!isExists) {
        this.tabsList.push(route);
      }
      return true;
    },
    closeLeftTabs(route: RouteItem) {
      // 关闭左侧
      const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath);
      this.tabsList.splice(0, index);
    },
    closeRightTabs(route: RouteItem) {
      // 关闭右侧
      const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath);
      this.tabsList.splice(index + 1);
    },
    closeOtherTabs(route: RouteItem) {
      // 关闭其他，并且不能关闭首页
      this.tabsList = this.tabsList.filter((item) => item.fullPath == route.fullPath || item.fullPath === PAGE_ENUM.HOME_PATH);
    },
    closeCurrentTab(route: RouteItem) {
      // 关闭当前页
      const index = this.tabsList.findIndex((item) => item.fullPath == route.fullPath);
      this.tabsList.splice(index, 1);
    },
    closeAllTabs() {
      // 关闭全部
      this.tabsList = [];
    },
  },
});
