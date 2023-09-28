// 用户全局配置
export interface UserState {
  token: string;
  info: ApiUserInfo;
  configInfo: ApiConfigInfo;
}

// 锁屏配置
export type LockScreenState = {
  isLock: boolean; // 是否锁屏
  lockTime: number;
};

// 路由配置
export interface RouteState {
  menus: AppRouteRecordRaw[];
  searchMenus: ViewsMenu[];
  // routers: any[];
  addRouters: AppRouteRecordRaw[];
  keepAliveComponents: string[];
  isDynamicAddedRoute: boolean;
}

// 标签页配置
export type TabsViewState = {
  tabsList: RouteItem[]; // 标签页
};
