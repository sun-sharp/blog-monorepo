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

  // 深色主题
  isDarkTheme: boolean;

  // 系统主题色
  appTheme: string;

  // 导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式
  navMode: string;

  // 导航风格 dark 暗色侧边栏 light 白色侧边栏 header-dark 暗色顶栏
  navTheme: string;

  // 顶部
  headerSetting: ApiConfHeaderSetting;

  // 底部
  footerSetting: ApiConfFooterSetting;

  // 多标签
  multiTabsSetting: ApiConfMultiTabsSetting;

  // 菜单
  menuSetting: ApiConfMenuSetting;

  // 面包屑
  crumbsSetting: ApiConfCrumbsSetting;

  // 是否开启路由动画
  isPageAnimate: boolean;

  // 路由动画类型
  pageAnimateType: string;
}

/**
 * @description: 配置信息
 */
export interface ApiConfigInfo extends Omit<ApiConfiguration, 'userId'> {}
