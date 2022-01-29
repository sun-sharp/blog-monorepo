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

export interface IbodySetting {
  fixed: boolean;
}

export interface IheaderSetting {
  bgColor: string;
  fixed: boolean;
  isReload: boolean;
}

export interface ImenuSetting {
  minMenuWidth: number;
  menuWidth: number;
  fixed: boolean;
  mixMenu: boolean;
  collapsed: boolean;
}

export interface IcrumbsSetting {
  show: boolean;
  showIcon: boolean;
}

export interface ImultiTabsSetting {
  bgColor: string;
  fixed: boolean;
  show: boolean;
}
export interface GlobConfig {
  baseUrl: string;
  title: string;
  capitalApiUrl: string;
  blogApiUrl: string;
  mockApiUrl: string;
  shortName: string;
  urlPrefix?: string;
  uploadUrl?: string;
  prodMock: boolean;
  imgUrl?: string;
}
