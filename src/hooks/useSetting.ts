import { computed } from 'vue';
import { useUserStore } from '@/store';
import { ApiAppTheme } from '/#/api/configuration';

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

  // 固定标签页
  const getTabsViewFixed = computed<boolean>(() => userStore.getConfigInfo.tabsViewFixed);

  // 固定底部
  const getFooterFixed = computed<boolean>(() => userStore.getConfigInfo.footerFixed);

  // 显示重载页面按钮
  const getHeaderReloadShow = computed<boolean>(() => userStore.getConfigInfo.headerReloadShow);

  return {
    getAppTheme,
    getAppThemeColor,
    getNavMode,
    getSiderIsDark,
    getHeadIsDark,
    getHeadFixed,
    getTabsViewFixed,
    getFooterFixed,
    getHeaderReloadShow,
  };
};
