import { computed } from 'vue';
import { useUserStore } from '@/store';

export function useProjectSetting() {
  const userStore = useUserStore();

  const getNavMode = computed(() => userStore.getNavMode);

  const getNavTheme = computed(() => userStore.getNavTheme);

  const getHeaderSetting = computed(() => userStore.getHeaderSetting);

  const getMultiTabsSetting = computed(() => userStore.getMultiTabsSetting);

  const getMenuSetting = computed(() => userStore.getMenuSetting);

  const getCrumbsSetting = computed(() => userStore.getCrumbsSetting);

  const getShowFooter = computed(() => userStore.getShowFooter);

  const getIsPageAnimate = computed(() => userStore.getIsPageAnimate);

  const getPageAnimateType = computed(() => userStore.getPageAnimateType);

  const getDarkTheme = computed(() => userStore.getDarkTheme);

  const getAppTheme = computed(() => userStore.getAppTheme);

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
  };
}
