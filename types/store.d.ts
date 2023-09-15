// 用户全局配置
export interface UserState {
  token: string;
  info: ApiUserInfo;
  configInfo: CUserConfigInfo;
}

// 锁屏配置
export type LockScreenState = {
  isLock: boolean; // 是否锁屏
  lockTime: number;
};

// 路由配置
export interface RouteState {
  // menus: AppRouteRecordRaw[];
  // searchMenus: MenuType[];
  // routers: any[];
  // addRouters: any[];
  keepAliveComponents: string[];
  isDynamicAddedRoute: boolean;
}
