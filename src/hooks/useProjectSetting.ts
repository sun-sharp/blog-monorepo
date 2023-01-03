import { computed } from 'vue';
import { useSettingStore } from '@/store';

export function useProjectSetting() {
  const settingStore = useSettingStore();

  const getNavMode = computed(() => settingStore.navMode);

  const getNavTheme = computed(() => settingStore.navTheme);

  const getHeaderSetting = computed(() => settingStore.headerSetting);

  const getMultiTabsSetting = computed(() => settingStore.multiTabsSetting);

  const getMenuSetting = computed(() => settingStore.menuSetting);

  const getCrumbsSetting = computed(() => settingStore.crumbsSetting);

  const getShowFooter = computed(() => settingStore.showFooter);

  const getIsPageAnimate = computed(() => settingStore.isPageAnimate);

  const getPageAnimateType = computed(() => settingStore.pageAnimateType);

  const getDarkTheme = computed(() => settingStore.darkTheme);

  const getAppTheme = computed(() => settingStore.appTheme);

  const getAppThemeList = computed(() => settingStore.appThemeList);

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
    getDarkTheme,
    getAppTheme,
    getAppThemeList,
  };
}
