// env 配置
export interface GlobConfig {
  baseUrl: string;
  title: string;
  capitalApiUrl: string;
  blogApiUrl: string;
  shortName: string;
  urlPrefix?: string;
  imgUrl?: string;
  tokenHead?: string;
}

// 用户信息
export interface CUserConfigInfo {
  // 导航模式
  navMode: ApiConfNavMode;
  // 导航风格
  navTheme: string;
  // 顶部设置
  headerSetting: ApiConfHeaderSetting;
  // 底部设置
  footerSetting: ApiConfFooterSetting;
  // 菜单设置
  menuSetting: ApiConfMenuSetting;
  // 多标签
  multiTabsSetting: ApiConfMultiTabsSetting;
  // 面包屑
  crumbsSetting: ApiConfCrumbsSetting;
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
  roleName: string;
  userId: string;
  username: string;
}

// 用户全局配置
export interface CUserState {
  token: string;
  info: CUserInfo;
  // configInfo: CUserConfigInfo;
}

// 登录传参
export interface CLoginFormState {
  username: string;
  password: string;
}

// 下拉选择器的参数
export interface CNumOption {
  value: number;
  label: string;
}

// 下拉选择器的参数
export interface CStrOption {
  value: string;
  label: string;
}
