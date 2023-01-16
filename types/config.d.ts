// env 配置
export interface GlobConfig {
  baseUrl: string;
  title: string;
  capitalApiUrl: string;
  blogApiUrl: string;
  fileApiUrl: string;
  moneyApiUrl: string;
  shortName: string;
  urlPrefix?: string;
  imgUrl?: string;
  tokenHead?: string;
}

// 顶部设置
export interface CHeaderSetting {
  fixed: boolean;
  isReload: boolean;
}

// 菜单设置
export interface CMenuSetting {
  minMenuWidth: number;
  menuWidth: number;
  fixed: boolean;
  mixMenu: boolean;
  collapsed: boolean;
}

// 面包屑
export interface CCrumbsSetting {
  show: boolean;
  showIcon: boolean;
}

// 多标签
export interface CMultiTabsSetting {
  fixed: boolean;
  show: boolean;
}

// 用户信息
export interface CUserConfigInfo {
  // 导航模式
  navMode: string;
  // 导航风格
  navTheme: string;
  // 顶部设置
  headerSetting: CHeaderSetting;
  // 页脚
  showFooter: boolean;
  // 菜单设置
  menuSetting: CMenuSetting;
  // 多标签
  multiTabsSetting: CMultiTabsSetting;
  // 面包屑
  crumbsSetting: CCrumbsSetting;
  // 是否开启路由动画
  isPageAnimate: boolean;
  // 路由动画类型
  pageAnimateType: string;
  // 深色主题
  isDarkTheme: boolean;
  // 系统风格
  appTheme: string;
}


// 用户信息
export interface CUserInfo {
  avatar: string;
  loginDate: string;
  nickname: string;
  roleCode: string;
  userId: string;
  username: string;
}

// 用户全局配置
export interface CUserState {
  token: string;
  info: CUserInfo;
  configInfo: CUserConfigInfo;
}

// 登录传参
export interface CLoginFormState {
  username: string;
  password: string;
}

