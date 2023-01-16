import at from 'await-to-js';
import { defineStore } from 'pinia';
import { storage } from '@/utils';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_LOCK_SCREEN, ResultEnum } from '@/constant';
import { capitalApi, userApi } from '@/api';
import { getAppEnvConfig } from '@/utils/env';
import { LoginFormState, PiniaUserState, UserInfo } from '/#/config';

const appEnvConfig = getAppEnvConfig();

// 默认用户信息
const defaultUserInfo = {
  avatar: '',
  loginDate: '',
  nickname: '',
  roleCode: '',
  userId: '',
  username: '',
};

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): PiniaUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    info: storage.get(CURRENT_USER, defaultUserInfo),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getCompleteToken(): string {
      const { tokenHead } = appEnvConfig;
      return tokenHead ? tokenHead + this.token : this.token;
    },
    getUserInfo(): UserInfo {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUserInfo(info: UserInfo) {
      this.info = info;
    },
    // 登录
    async login(loginForm: LoginFormState) {
      const [err, resp] = await at(capitalApi.login(loginForm));
      if (err) return err;
      const { result, code } = resp;
      if (code === ResultEnum.SUCCESS) {
        storage.set(ACCESS_TOKEN, result.token);
        storage.set(IS_LOCK_SCREEN, false);
        this.setToken(result.token);
      }
      return resp;
    },
    // 获取用户信息
    async GetInfo() {
      const that = this;
      const [err, resp] = await at(userApi.getUserInfo());
      if (err) return false;
      storage.set(CURRENT_USER, resp);
      that.setUserInfo(resp);
      return resp;
    },
    // 登出
    async logout() {
      this.setUserInfo(defaultUserInfo);
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
      return Promise.resolve('');
    },
  },
});

// 需要在设置之外使用
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
