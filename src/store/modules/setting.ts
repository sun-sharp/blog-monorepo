import { defineStore } from 'pinia';
import { store } from '@/store';
import { projectSetting, designSetting, USER_CONFIG } from '@/constant';
import type { ICrumbsSetting, IHeaderSetting, IMenuSetting, IMultiTabsSetting, UserConfigInfo } from '/#/config';
import at from 'await-to-js';
import { configurationApi } from '@/api';
import { storage } from '@/utils';

const { navTheme, headerSetting, showFooter, menuSetting, multiTabsSetting, crumbsSetting, isPageAnimate, pageAnimateType } = projectSetting;

const { darkTheme, appTheme } = designSetting;

export const useSettingStore = defineStore({
  id: 'app-project-setting',
  state: (): UserConfigInfo => {
    const userConfig = storage.get(USER_CONFIG, {});
    console.log(userConfig, 'userConfig');
    const { navMode = '' } = userConfig;

    return {
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
    };
  },
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
  },
  actions: {
    // 获取用户配置
    async GetConfigInfo() {
      // const self = this;
      const [err, resp] = await at(configurationApi.getConfigInfo());
      if (err) return false;
      storage.set(USER_CONFIG, resp);
      console.log(resp);
      return resp;
    },
  },
});

// 需要在设置之外使用
export function useSettingStoreWithOut() {
  return useSettingStore(store);
}
