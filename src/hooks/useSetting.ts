import { computed } from 'vue';
import { useUserStore } from '@/store';
import {
  ApiAppTheme,
  ApiConfCrumbsSetting,
  ApiConfFooterSetting,
  ApiConfHeaderSetting,
  ApiConfMenuSetting,
  ApiConfMultiTabsSetting,
} from '/#/api/configuration';

export const useSetting = () => {
  const userStore = useUserStore();

  const getAppTheme = computed<ApiAppTheme>(() => userStore.getConfigInfo.appTheme);

  const getAppThemeColor = computed<string>(() => userStore.getConfigInfo.appThemeColor);

  const getNavMode = computed<string>(() => userStore.getConfigInfo.navMode);

  const getHeaderSetting = computed<ApiConfHeaderSetting>(() => userStore.getConfigInfo.headerSetting);

  const getMultiTabsSetting = computed<ApiConfMultiTabsSetting>(() => userStore.getConfigInfo.multiTabsSetting);

  const getMenuSetting = computed<ApiConfMenuSetting>(() => userStore.getConfigInfo.menuSetting);

  const getCrumbsSetting = computed<ApiConfCrumbsSetting>(() => userStore.getConfigInfo.crumbsSetting);

  const getIsPageAnimate = computed<boolean>(() => userStore.getConfigInfo.isPageAnimate);

  const getPageAnimateType = computed<string>(() => userStore.getConfigInfo.pageAnimateType);

  const getFooterSetting = computed<ApiConfFooterSetting>(() => userStore.getConfigInfo.footerSetting);

  const getSiderIsDark = computed<boolean>(() => userStore.getConfigInfo.siderIsDark);

  const getHeadIsDark = computed<boolean>(() => userStore.getConfigInfo.headIsDark);

  return {
    getAppTheme,
    getAppThemeColor,
    getNavMode,
    getHeaderSetting,
    getMultiTabsSetting,
    getMenuSetting,
    getCrumbsSetting,
    getFooterSetting,
    getIsPageAnimate,
    getPageAnimateType,
    getSiderIsDark,
    getHeadIsDark,
  };
};
