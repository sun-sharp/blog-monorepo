import { defineStore } from 'pinia';
import { store } from '@/store';
import { projectSetting, designSetting, appThemeList } from '@/constant';
import type { ICrumbsSetting, IHeaderSetting, IMenuSetting, IMultiTabsSetting, SettingState } from '/#/config';

const { navMode, navTheme, headerSetting, showFooter, menuSetting, multiTabsSetting, crumbsSetting, isPageAnimate, pageAnimateType } = projectSetting;

const { darkTheme, appTheme } = designSetting;

export const useSettingStore = defineStore({
  id: 'app-project-setting',
  state: (): SettingState => ({
    navMode,
    navTheme,
    headerSetting,
    showFooter,
    menuSetting,
    multiTabsSetting,
    crumbsSetting,
    isPageAnimate,
    pageAnimateType,
    darkTheme,
    appTheme,
    appThemeList,
  }),
  getters: {
    getNavMode(): string {
      return this.navMode;
    },
    getNavTheme(): string {
      return this.navTheme;
    },
    getHeaderSetting(): IHeaderSetting {
      return this.headerSetting;
    },
    getShowFooter(): boolean {
      return this.showFooter;
    },
    getMenuSetting(): IMenuSetting {
      return this.menuSetting;
    },
    getMultiTabsSetting(): IMultiTabsSetting {
      return this.multiTabsSetting;
    },
    getCrumbsSetting(): ICrumbsSetting {
      return this.crumbsSetting;
    },
    getIsPageAnimate(): boolean {
      return this.isPageAnimate;
    },
    getPageAnimateType(): string {
      return this.pageAnimateType;
    },
    getDarkTheme(): boolean {
      return this.darkTheme;
    },
    getAppTheme(): string {
      return this.appTheme;
    },
    getAppThemeList(): string[] {
      return this.appThemeList;
    },
  },
  actions: {
    setNavTheme(value: string): void {
      this.navTheme = value;
    },
  },
});

// 需要在设置之外使用
export function useSettingStoreWithOut() {
  return useSettingStore(store);
}
