import { computed } from 'vue';
import { useUserStore } from '@/store';
import { ApiAnimate, ApiAppTheme } from '/#/api/configuration';

export const useSetting = () => {
  const userStore = useUserStore();

  // 系统主题
  const getAppTheme = computed<ApiAppTheme>(() => userStore.getConfigInfo.appTheme);

  // 系统主题色
  const getAppThemeColor = computed<string>(() => userStore.getConfigInfo.appThemeColor);

  // 菜单模式
  const getNavMode = computed<string>(() => userStore.getConfigInfo.navMode);

  // 侧边栏主题是否暗色
  const getSiderIsDark = computed<boolean>(() => userStore.getConfigInfo.siderIsDark);

  // 顶栏主题是否暗色
  const getHeadIsDark = computed<boolean>(() => userStore.getConfigInfo.headIsDark);

  // 固定顶栏
  const getHeadFixed = computed<boolean>(() => userStore.getConfigInfo.headFixed);

  // 显示标签页
  const getTabsViewShow = computed<boolean>(() => userStore.getConfigInfo.tabsViewShow);

  // 固定标签页
  const getTabsViewFixed = computed<boolean>(() => userStore.getConfigInfo.tabsViewFixed);

  // 显示页脚
  const getFooterShow = computed<boolean>(() => userStore.getConfigInfo.footerShow);

  // 固定页脚
  const getFooterFixed = computed<boolean>(() => userStore.getConfigInfo.footerFixed);

  // 显示重载页面按钮
  const getHeaderReloadShow = computed<boolean>(() => userStore.getConfigInfo.headerReloadShow);

  // 显示面包屑导航
  const getHeaderBreadcrumbShow = computed<boolean>(() => userStore.getConfigInfo.headerBreadcrumbShow);

  // 显示面包屑显示图标
  const getHeaderBreadcrumbShowIcon = computed<boolean>(() => userStore.getConfigInfo.headerBreadcrumbShowIcon);

  // 页面跳转动画
  const getHasPageAnimate = computed<boolean>(() => userStore.getConfigInfo.hasPageAnimate);

  // 页面跳转动画类型
  const getPageAnimateType = computed<ApiAnimate>(() => userStore.getConfigInfo.pageAnimateType);

  return {
    getAppTheme,
    getAppThemeColor,
    getNavMode,
    getSiderIsDark,
    getHeadIsDark,
    getHeadFixed,
    getTabsViewShow,
    getTabsViewFixed,
    getFooterShow,
    getFooterFixed,
    getHeaderReloadShow,
    getHeaderBreadcrumbShow,
    getHeaderBreadcrumbShowIcon,
    getHasPageAnimate,
    getPageAnimateType,
  };
};
