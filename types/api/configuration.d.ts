/**
 * @description: 导航模式
 * vertical 左侧菜单模式
 * horizontal 顶部菜单模式
 * horizontal-mix 顶部菜单混合模式
 */
export type ApiConfNavMode = 'vertical' | 'horizontal' | 'horizontal-mix';

/**
 * @description: 系统主题
 * dark 深色
 * light 浅色
 */
export type ApiAppTheme = 'light' | 'dark';

/**
 * @description: 设置的id
 */
export interface ApiImageId {
  // 图片id
  imageId: string;
}

/**
 * @description 顶部字段
 */
export interface ApiConfHeaderSetting {
  //固定顶部
  fixed: boolean;
  //显示重载按钮
  isReload: boolean;
}

/**
 * @description 多标签字段
 */
export interface ApiConfMultiTabsSetting {
  // 是否显示
  show: boolean;
  // 固定多标签
  fixed: boolean;
}

/**
 * @description 菜单
 */
export interface ApiConfMenuSetting {
  // 最小宽度
  minMenuWidth: number;
  // 菜单宽度
  menuWidth: number;
  // 固定菜单
  fixed: boolean;
  // 分割菜单
  mixMenu: boolean;
  // 默认展开
  collapsed: boolean;
}

/**
 * @description 面包屑
 */
export interface ApiConfCrumbsSetting {
  // 是否显示
  show: boolean;
  // 显示图标
  showIcon: boolean;
}

/**
 * @description 底部字段
 */
export interface ApiConfFooterSetting {
  // 是否显示
  show: boolean;
  //固定底部
  fixed: boolean;
}

/**
 * @description: 设置配置字段
 */
export interface ApiConfiguration {
  // 用户id
  userId: string;
  // 系统主题
  appTheme: ApiAppTheme;
  // 系统主题色
  appThemeColor: string;
  // 导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式
  navMode: string;
  // 侧边栏深色主题
  siderIsDark: boolean;
  // 顶栏样式
  headIsDark: boolean;
  // 固定顶栏
  headFixed: boolean;
  // 显示标签页
  tabsViewShow: boolean;
  // 固定标签页
  tabsViewFixed: boolean;
  // 显示页脚
  footerShow: boolean;
  // 固定页脚
  footerFixed: boolean;
  // 显示重载页面按钮
  headerReloadShow: boolean;
  // 显示面包屑导航
  headerBreadcrumbShow: boolean;
  // 显示面包屑显示图标
  headerBreadcrumbShowIcon: boolean;
}

/**
 * @description: 配置信息
 */
export interface ApiConfigInfo extends Omit<ApiConfiguration, 'userId'> {}
