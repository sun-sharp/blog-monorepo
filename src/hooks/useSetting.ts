import { computed } from 'vue';
import { useUserStore } from '@/store';
import { ApiConfCrumbsSetting, ApiConfFooterSetting, ApiConfHeaderSetting, ApiConfMenuSetting, ApiConfMultiTabsSetting } from '/#/api/configuration';

export const useSetting = () => {
  const userStore = useUserStore();

  const getNavMode = computed<string>(() => userStore.getConfigInfo.navMode);

  const getHeaderSetting = computed<ApiConfHeaderSetting>(() => userStore.getConfigInfo.headerSetting);

  const getMultiTabsSetting = computed<ApiConfMultiTabsSetting>(() => userStore.getConfigInfo.multiTabsSetting);

  const getMenuSetting = computed<ApiConfMenuSetting>(() => userStore.getConfigInfo.menuSetting);

  const getCrumbsSetting = computed<ApiConfCrumbsSetting>(() => userStore.getConfigInfo.crumbsSetting);

  const getIsPageAnimate = computed<boolean>(() => userStore.getConfigInfo.isPageAnimate);

  const getPageAnimateType = computed<string>(() => userStore.getConfigInfo.pageAnimateType);

  const getIsDarkTheme = computed<boolean>(() => userStore.getConfigInfo.isDarkTheme);

  const getAppTheme = computed<string>(() => userStore.getConfigInfo.appTheme);

  const getFooterSetting = computed<ApiConfFooterSetting>(() => userStore.getConfigInfo.footerSetting);

  const getSiderIsDark = computed<boolean>(() => userStore.getConfigInfo.siderIsDark);

  const getTopBarStyle = computed<string>(() => userStore.getConfigInfo.topBarStyle);

  return {
    getNavMode,
    getHeaderSetting,
    getMultiTabsSetting,
    getMenuSetting,
    getCrumbsSetting,
    getFooterSetting,
    getIsPageAnimate,
    getPageAnimateType,
    getIsDarkTheme,
    getAppTheme,
    getSiderIsDark,
    getTopBarStyle,
  };
};
