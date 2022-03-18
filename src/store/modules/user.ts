import { defineStore } from 'pinia';
import { createStorage, storage } from '@/utils';
import { store } from '@/store';
import {
  ACCESS_TOKEN,
  CURRENT_USER,
  IS_LOCK_SCREEN,
  ResultEnum,
  // IS_LOCK_SCREEN, ResultEnum
} from '@/constant';

const Storage = createStorage({ storage: localStorage });
import { capitalApi, userApi } from '@/api';
import at from 'await-to-js';

export interface IUserState {
  token: string;
  // username: string;
  // welcome: string;
  avatar: string;
  info: any;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: Storage.get(ACCESS_TOKEN, ''),
    // username: '',
    // welcome: '',
    avatar: '',
    info: Storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    // getAvatar(): string {
    //   return this.avatar;
    // },
    // getNickname(): string {
    //   return this.username;
    // }
    getUserInfo(): object {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setUserInfo(info) {
      this.info = info;
    },
    // 登录
    async login(userInfo: any) {
      const [err, resp] = await at(capitalApi.login(userInfo));
      if (err) return err;
      const { result, code } = resp;
      if (code === ResultEnum.SUCCESS) {
        const ex = 7 * 24 * 60 * 60 * 1000;
        storage.set(ACCESS_TOKEN, result.token, ex);
        storage.set(CURRENT_USER, result, ex);
        storage.set(IS_LOCK_SCREEN, false);
        this.setToken(result.token);
        this.setUserInfo(result);
      }
      return resp;
    },

    // 获取用户信息
    async GetInfo() {
      const that = this;
      const [err, resp] = await at(userApi.getUserInfo());
      console.log(err, resp, 'err, resp');
      if (err) return false;
      that.setUserInfo(resp);
      that.setAvatar(resp.avatar);
      return resp;
    },

    // 登出
    async logout() {
      this.setUserInfo('');
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
