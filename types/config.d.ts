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

export interface IBodySetting {
  fixed: boolean;
}

export interface IHeaderSetting {
  fixed: boolean;
  isReload: boolean;
}

export interface IMenuSetting {
  minMenuWidth: number;
  menuWidth: number;
  fixed: boolean;
  mixMenu: boolean;
  collapsed: boolean;
}

export interface ICrumbsSetting {
  show: boolean;
  showIcon: boolean;
}

export interface IMultiTabsSetting {
  fixed: boolean;
  show: boolean;
}

// 用户信息
export interface UserConfigInfo {
  //导航模式
  navMode: string;
  //导航风格
  navTheme: string;
  //顶部设置
  headerSetting: IHeaderSetting;
  //页脚
  showFooter: boolean;
  //菜单设置
  menuSetting: IMenuSetting;
  //多标签
  multiTabsSetting: IMultiTabsSetting;
  //面包屑
  crumbsSetting: ICrumbsSetting;
  //是否开启路由动画
  isPageAnimate: boolean;
  //路由动画类型
  pageAnimateType: string;
  //深色主题
  darkTheme: boolean;
  //系统风格
  appTheme: string;
}


// 用户信息
export interface UserInfo {
  avatar: string;
  loginDate: string;
  nickname: string;
  roleCode: string;
  userId: string;
  username: string;
}

// 用户全局配置
export interface PiniaUserState {
  token: string;
  info: UserInfo;
  configInfo?: UserConfigInfo;
}

