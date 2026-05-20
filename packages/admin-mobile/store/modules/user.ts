import { defineStore } from 'pinia';
import { storage } from '@/utils/storage-adapter';
import { ACCESS_TOKEN, APP_ENV_CONFIG, CURRENT_USER, IS_LOCK_SCREEN, RESULT_ENUM, USER_CONFIG } from '@/constant';
import { capitalApi, configurationApi, userApi } from '@/api';
import { ApiCapitalLoginData, ApiCapitalLoginResult } from '/#/api/capital';
import { ApiUserInfo } from '/#/api/capital/user';
import { ApiResponse } from '/#/api/common';
import { ApiConfigInfo } from '/#/api/capital/configuration';

const defaultUserInfo: ApiUserInfo = {
  avatar: '',
  nickname: '',
  username: '',
  loginDate: '',
  roleCode: '',
  roleName: '',
  userId: '',
};

interface UserState {
  token: string;
  info: ApiUserInfo;
  configInfo: ApiConfigInfo;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    info: storage.get(CURRENT_USER, defaultUserInfo),
    configInfo: storage.get(USER_CONFIG, {} as ApiConfigInfo),
  }),
  getters: {
    getCompleteToken(): string {
      const tokenHead = APP_ENV_CONFIG.tokenHead || 'Bearer ';
      return `${tokenHead}${this.token}`;
    },
    getUserInfo(): ApiUserInfo {
      return this.info;
    },
    getConfigInfo(): ApiConfigInfo {
      return this.configInfo;
    },
  },
  actions: {
    async login(loginForm: ApiCapitalLoginData) {
      const res: ApiResponse<ApiCapitalLoginResult> = await capitalApi.login(loginForm);
      const { token } = res.result || res;
      if (token) {
        this.token = token;
        storage.set(ACCESS_TOKEN, token);
      }
      return res;
    },

    async GetInfo(): Promise<ApiUserInfo> {
      const info = await userApi.getUserInfo();
      this.info = info;
      storage.set(CURRENT_USER, info);
      return info;
    },

    async GetConfigInfo(): Promise<ApiConfigInfo> {
      const configInfo = await configurationApi.getConfigInfo();
      const result: ApiConfigInfo = {
        navMode: configInfo.navMode,
        theme: configInfo.theme,
        headerDark: configInfo.headerDark,
        siderDark: configInfo.siderDark,
        tabs: configInfo.tabs,
        footer: configInfo.footer,
        breadcrumb: configInfo.breadcrumb,
        pageAnimate: configInfo.pageAnimate,
        pageAnimateType: configInfo.pageAnimateType,
      };
      this.configInfo = result;
      storage.set(USER_CONFIG, result);
      return result;
    },

    logout() {
      this.token = '';
      this.info = defaultUserInfo;
      this.configInfo = {} as ApiConfigInfo;
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
      storage.remove(USER_CONFIG);
      storage.remove(IS_LOCK_SCREEN);
    },
  },
});

export function useUserStoreWidthOut() {
  return useUserStore();
}
