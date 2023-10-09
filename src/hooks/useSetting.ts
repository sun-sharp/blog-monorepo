import { computed } from 'vue';
import { useUserStore } from '@/store';
import {
  ApiAppTheme,
  // ApiConfCrumbsSetting,
  // ApiConfFooterSetting,
  // ApiConfHeaderSetting,
  // ApiConfMenuSetting,
  // ApiConfMultiTabsSetting,
} from '/#/api/configuration';

export const useSetting = () => {
  const userStore = useUserStore();

  // 系统主题
  const getAppTheme = computed<ApiAppTheme>(() => userStore.getConfigInfo.appTheme);

  // 系统主题色
  const getAppThemeColor = computed<string>(() => userStore.getConfigInfo.appThemeColor);

  // 菜单模式
  const getNavMode = computed<string>(() => userStore.getConfigInfo.navMode);

  // const getHeaderSetting = computed<ApiConfHeaderSetting>(() => userStore.getConfigInfo.headerSetting);

  // const getMultiTabsSetting = computed<ApiConfMultiTabsSetting>(() => userStore.getConfigInfo.multiTabsSetting);

  // const getMenuSetting = computed<ApiConfMenuSetting>(() => userStore.getConfigInfo.menuSetting);

  // const getCrumbsSetting = computed<ApiConfCrumbsSetting>(() => userStore.getConfigInfo.crumbsSetting);

  // const getIsPageAnimate = computed<boolean>(() => userStore.getConfigInfo.isPageAnimate);

  // const getPageAnimateType = computed<string>(() => userStore.getConfigInfo.pageAnimateType);

  // const getFooterSetting = computed<ApiConfFooterSetting>(() => userStore.getConfigInfo.footerSetting);

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

  return {
    getAppTheme,
    getAppThemeColor,
    getNavMode,
    // getHeaderSetting,
    // getMultiTabsSetting,
    // getMenuSetting,
    // getCrumbsSetting,
    // getFooterSetting,
    // getIsPageAnimate,
    // getPageAnimateType,
    getSiderIsDark,
    getHeadIsDark,
    getHeadFixed,
    getTabsViewFixed,
    getFooterFixed,
  };
};
