import { computed } from 'vue';
import { useUserStore } from '@/store';
import { CCrumbsSetting, CHeaderSetting, CMenuSetting, CMultiTabsSetting } from '/#/config';

export const useSetting = () => {
  const userStore = useUserStore();

  const getNavMode = computed<string>(() => userStore.getConfigInfo.navMode);

  const getNavTheme = computed<string>(() => userStore.getConfigInfo.navTheme);

  const getHeaderSetting = computed<CHeaderSetting>(() => userStore.getConfigInfo.headerSetting);

  const getMultiTabsSetting = computed<CMultiTabsSetting>(() => userStore.getConfigInfo.multiTabsSetting);

  const getMenuSetting = computed<CMenuSetting>(() => userStore.getConfigInfo.menuSetting);

  const getCrumbsSetting = computed<CCrumbsSetting>(() => userStore.getConfigInfo.crumbsSetting);

  const getShowFooter = computed<boolean>(() => userStore.getConfigInfo.showFooter);

  const getIsPageAnimate = computed<boolean>(() => userStore.getConfigInfo.isPageAnimate);

  const getPageAnimateType = computed<string>(() => userStore.getConfigInfo.pageAnimateType);

  const getIsDarkTheme = computed<boolean>(() => userStore.getConfigInfo.isDarkTheme);

  const getAppTheme = computed<string>(() => userStore.getConfigInfo.appTheme);

  return {
    getNavMode,
    getNavTheme,
    getHeaderSetting,
    getMultiTabsSetting,
    getMenuSetting,
    getCrumbsSetting,
    getShowFooter,
    getIsPageAnimate,
    getPageAnimateType,
    getIsDarkTheme,
    getAppTheme,
  };
};
