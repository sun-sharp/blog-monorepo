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

export interface SettingState {
  //导航模式
  navMode: string;
  //导航风格
  navTheme: string;
  //顶部设置
  headerSetting: object;
  //页脚
  showFooter: boolean;
  //菜单设置
  menuSetting: object;
  //多标签
  multiTabsSetting: object;
  //面包屑
  crumbsSetting: object;
  //是否开启路由动画
  isPageAnimate: boolean;
  //路由动画类型
  pageAnimateType: string;
  //深色主题
  darkTheme: boolean;
  //系统风格
  appTheme: string;
  //系统内置风格
  appThemeList: string[];
}

export interface IBodySetting {
  fixed: boolean;
}

export interface IHeaderSetting {
  bgColor: string;
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
  bgColor: string;
  fixed: boolean;
  show: boolean;
}
