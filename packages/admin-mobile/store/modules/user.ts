import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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

export const useUserStore = defineStore('app-user', () => {
  // ========== State (用 ref 保持响应性) ==========
  const token = ref(storage.get(ACCESS_TOKEN, ''));
  const info = ref<ApiUserInfo>(storage.get(CURRENT_USER, defaultUserInfo));
  const configInfo = ref<ApiConfigInfo>(storage.get(USER_CONFIG, defaultConfigInfo));

  // ========== Getters (用 computed 替代，解决鸿蒙端更新问题) ==========
  const getToken = computed(() => token.value);
  const getUserInfo = computed(() => info.value);
  const getConfigInfo = computed(() => configInfo.value);

  // ========== Actions ==========
  function setToken(newToken: string) {
    token.value = newToken;
  }

  function setUserInfo(newInfo: ApiUserInfo) {
    storage.set(CURRENT_USER, newInfo);
    info.value = newInfo;
  }

  function setConfigInfo(newConfig: ApiConfigInfo) {
    storage.set(USER_CONFIG, newConfig);
    configInfo.value = newConfig;
  }

  async function login(loginForm: ApiCapitalLoginData): Promise<ApiResponse<ApiCapitalLoginResult>> {
    try {
      const resp = await capitalApi.login(loginForm);
      const { result, code } = resp;
      if (code === ResultEnum.SUCCESS && result) {
        storage.set(ACCESS_TOKEN, result.token);
        setToken(result.token);
        await GetInfo();
      }
      return resp;
    } catch (err: any) {
      return { code: ResultEnum.ERROR as number, message: err.message || '登录失败' };
    }
  }

  async function GetInfo(): Promise<ApiUserInfo | undefined> {
    try {
      const resp = await userApi.getUserInfo();
      setUserInfo(resp);
      return resp;
    } catch {
      return undefined;
    }
  }

  async function GetConfigInfo() {
    try {
      const resp = await configurationApi.getConfigInfo();
      setConfigInfo(resp);
    } catch {
      return;
    }
  }

  function logout() {
    setToken('');
    storage.remove(ACCESS_TOKEN);
    setUserInfo(defaultUserInfo);
    storage.remove(CURRENT_USER);
    setConfigInfo(defaultConfigInfo);
    storage.remove(USER_CONFIG);
  }

  // ========== 暴露所有内容 ==========
  return {
    // state
    token,
    info,
    configInfo,
    // getters (computed)
    getToken,
    getUserInfo,
    getConfigInfo,
    // actions
    setToken,
    setUserInfo,
    setConfigInfo,
    login,
    GetInfo,
    GetConfigInfo,
    logout,
  };
});
