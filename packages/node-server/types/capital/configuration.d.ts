/**
 * @description: 设置配置字段
 */
export interface ApiConfiguration {
  // 用户id
  userId: string;
  // 系统主题
  appTheme: string;
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
  pageAnimateType: string;
}
