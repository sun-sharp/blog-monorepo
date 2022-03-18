export interface GlobConfig {
  baseUrl: string;
  title: string;
  capitalApiUrl: string;
  blogApiUrl: string;
  mockApiUrl: string;
  fileApiUrl: string;
  shortName: string;
  urlPrefix?: string;
  imgUrl?: string;
  tokenHead?: string;
}

export interface ProjectSettingState {
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
