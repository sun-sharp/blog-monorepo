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
 * @description: 系统主题
 * zoom-fade 渐变
 * zoom-out 闪现
 * fade 消退
 * fade-slide 滑动
 * fade-top 头部消退
 * fade-bottom 底部消退
 * fade-scale 缩放消退
 */
export type ApiAnimate = 'zoom-fade' | 'zoom-out' | 'fade' | 'fade-slide' | 'fade-top' | 'fade-bottom' | 'fade-scale';

/**
 * @description: 设置的id
 */
export interface ApiImageId {
  // 图片id
  imageId: string;
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
  // 页面跳转动画
  hasPageAnimate: boolean;
  // 页面跳转动画类型
  pageAnimateType: ApiAnimate;
}

/**
 * @description: 配置信息
 */
export interface ApiConfigInfo extends Omit<ApiConfiguration, 'userId'> {}
