import { defineStore } from 'pinia';
import { storage } from '../../utils/storage';
import { ACCESS_TOKEN, CURRENT_USER, USER_CONFIG } from '../../../shared/src/constants/storage-name';
import { ResultEnum } from '../../../shared/src/constants/http-enum';
import { capitalApi, configurationApi, userApi } from '../../api';
import type { ApiCapitalLoginData, ApiCapitalLoginResult } from '/#/api/capital';
import type { ApiUserInfo } from '/#/api/capital/user';
import type { ApiResponse } from '/#/api/common';
import type { ApiConfigInfo } from '/#/api/capital/configuration';

const defaultUserInfo: ApiUserInfo = {
  avatar: '',
  loginDate: '',
  nickname: '',
  roleCode: '',
  roleName: '',
  userId: '',
  username: '',
};

const defaultConfigInfo: ApiConfigInfo = {
  appTheme: 'light',
  appThemeColor: '#2d8cf0',
  navMode: 'vertical',
  siderIsDark: false,
  headIsDark: false,
  headFixed: true,
  tabsViewShow: true,
  tabsViewFixed: true,
  footerShow: true,
  footerFixed: true,
  headerReloadShow: true,
  headerBreadcrumbShow: true,
  headerBreadcrumbShowIcon: true,
  hasPageAnimate: true,
  pageAnimateType: 'zoom-fade',
};

export const useUserStore = defineStore({
  id: 'app-user',
  state: () => ({
    token: storage.get(ACCESS_TOKEN, ''),
    info: storage.get(CURRENT_USER, defaultUserInfo) as ApiUserInfo,
    configInfo: storage.get(USER_CONFIG, defaultConfigInfo) as ApiConfigInfo,
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getUserInfo(): ApiUserInfo {
      return this.info;
    },
    getConfigInfo(): ApiConfigInfo {
      return this.configInfo;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUserInfo(info: ApiUserInfo) {
      storage.set(CURRENT_USER, info);
      this.info = info;
    },
    setConfigInfo(configInfo: ApiConfigInfo) {
      storage.set(USER_CONFIG, configInfo);
      this.configInfo = configInfo;
    },
    async login(loginForm: ApiCapitalLoginData): Promise<ApiResponse<ApiCapitalLoginResult>> {
      try {
        const resp = await capitalApi.login(loginForm);
        const { result, code } = resp;
        if (code === ResultEnum.SUCCESS && result) {
          storage.set(ACCESS_TOKEN, result.token);
          this.setToken(result.token);
        }
        return resp;
      } catch (err: any) {
        return { code: ResultEnum.ERROR as number, message: err.message || '登录失败' };
      }
    },
    async GetInfo(): Promise<ApiUserInfo | undefined> {
      try {
        const resp = await userApi.getUserInfo();
        this.setUserInfo(resp);
        return resp;
      } catch {
        return undefined;
      }
    },
    async GetConfigInfo() {
      try {
        const resp = await configurationApi.getConfigInfo();
        this.setConfigInfo(resp);
      } catch {
        return;
      }
    },
    logout() {
      this.setToken('');
      storage.remove(ACCESS_TOKEN);
      this.setUserInfo(defaultUserInfo);
      storage.remove(CURRENT_USER);
      this.setConfigInfo(defaultConfigInfo);
      storage.remove(USER_CONFIG);
    },
  },
});
