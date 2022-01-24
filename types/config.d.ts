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

export interface GlobEnvConfig {
  // 标题
  VITE_GLOB_APP_TITLE: string;
  // capital接口地址
  VITE_GLOB_CAPITAL_API_URL: string;
  // blog接口地址
  VITE_GLOB_BLOG_API_URL: string;
  // mock接口地址
  VITE_GLOB_MOCK_API_URL: string;
  // 接口前缀
  VITE_GLOB_API_URL_PREFIX?: string;
  // Project abbreviation
  VITE_GLOB_APP_SHORT_NAME: string;
  // 图片上传地址
  VITE_GLOB_UPLOAD_URL?: string;
  //图片前缀地址
  VITE_GLOB_IMG_URL?: string;
  //生产环境开启mock
  VITE_GLOB_PROD_MOCK: boolean;
}
