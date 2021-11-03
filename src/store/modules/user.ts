import { defineStore } from 'pinia';
import { createStorage, storage } from '@/utils/Storage';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_LOCK_SCREEN } from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';

const Storage = createStorage({ storage: localStorage });
import { getUserInfo, login } from '@/api';

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
    async login(userInfo) {
      try {
        const response = await login(userInfo);
        const { result, code } = response;
        if (code === ResultEnum.SUCCESS) {
          const ex = 7 * 24 * 60 * 60 * 1000;
          storage.set(ACCESS_TOKEN, result.token, ex);
          storage.set(CURRENT_USER, result, ex);
          storage.set(IS_LOCK_SCREEN, false);
          this.setToken(result.token);
          this.setUserInfo(result);
        }
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },

    // 获取用户信息
    GetInfo() {
      const that = this;
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const result = res;
            that.setUserInfo(result);
            that.setAvatar(result.avatar);
            resolve(res);
          })
          .catch((error) => {
            // that.logout();
            reject(error);
          });
      });
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
