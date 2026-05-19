import at from 'await-to-js';
import { defineStore } from 'pinia';
import { storage } from '@/utils';
import { store } from '@/store';
import { ACCESS_TOKEN, APP_ENV_CONFIG, CURRENT_USER, IS_LOCK_SCREEN, RESULT_ENUM, USER_CONFIG } from '@/constant';
import {
  capitalApi,
  configurationApi,
  // configurationApi,
  userApi,
} from '@/api';
import { UserState } from '/#/store';
import { ApiCapitalLoginData, ApiCapitalLoginResult } from '/#/api/capital';
import { ApiUserInfo } from '/#/api/capital/user';
import { ApiResponse } from '/#/api/common';
import { ApiConfigInfo } from '/#/api/configuration';

// 默认用户信息
const defaultUserInfo: ApiUserInfo = {
  avatar: '',
  loginDate: '',
  nickname: '',
  roleCode: '',
  roleName: '',
  userId: '',
  username: '',
};

// 默认配置信息
const defaultConfigInfo: ApiConfigInfo = {
  // 系统主题
  appTheme: 'light',
  // 系统主题色
  appThemeColor: '#2d8cf0',
  // 导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式
  navMode: 'vertical',
  // 侧边栏样式
  siderIsDark: false,
  // 顶栏样式
  headIsDark: false,
  // 固定顶栏
  headFixed: true,
  // 固定标签页
  tabsViewShow: true,
  // 固定标签页
  tabsViewFixed: true,
  // 显示页脚
  footerShow: true,
  // 固定页脚
  footerFixed: true,
  // 显示重载页面按钮
  headerReloadShow: true,
  // 显示面包屑导航
  headerBreadcrumbShow: true,
  // 显示面包屑显示图标
  headerBreadcrumbShowIcon: true,
  // 页面跳转动画
  hasPageAnimate: true,
  // 页面跳转动画类型
  pageAnimateType: 'zoom-fade',
};

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    info: storage.get(CURRENT_USER, defaultUserInfo),
    configInfo: storage.get(USER_CONFIG, defaultConfigInfo),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getCompleteToken(): string {
      const { tokenHead } = APP_ENV_CONFIG;
      return tokenHead ? tokenHead + this.token : this.token;
    },
    getUserInfo(): ApiUserInfo {
      return this.info;
    },
    getConfigInfo(): ApiConfigInfo {
      return this.configInfo;
    },
  },
  actions: {
    // 设置token
    setToken(token: string) {
      this.token = token;
    },
    // 设置用户信息
    setUserInfo(info: ApiUserInfo) {
      storage.set(CURRENT_USER, info);
      this.info = info;
    },
    // 设置配置信息
    setConfigInfo(configInfo: ApiConfigInfo) {
      storage.set(USER_CONFIG, configInfo);
      this.configInfo = configInfo;
    },
    // 登录
    async login(loginForm: ApiCapitalLoginData): Promise<ApiResponse<ApiCapitalLoginResult>> {
      const [err, resp] = await at(capitalApi.login(loginForm));
      if (err) return { code: RESULT_ENUM.ERROR, message: err.message };
      const { result, code } = resp;
      if (code === RESULT_ENUM.SUCCESS && result) {
        storage.set(ACCESS_TOKEN, result.token);
        storage.set(IS_LOCK_SCREEN, false);
        this.setToken(result.token);
      }
      return resp;
    },
    // 获取用户信息
    async GetInfo(): Promise<ApiUserInfo | undefined> {
      const self = this;
      const [err, resp] = await at(userApi.getUserInfo());
      if (err || !resp) return;
      self.setUserInfo(resp);
      return resp;
    },
    // 获取用户配置
    async GetConfigInfo() {
      const self = this;
      const [err, resp] = await at(configurationApi.getConfigInfo());
      if (err || !resp) return;
      self.setConfigInfo(resp);
      return;
    },
    // 登出
    logout() {
      this.setToken('');
      storage.remove(ACCESS_TOKEN);
      this.setUserInfo(defaultUserInfo);
      storage.remove(CURRENT_USER);
      this.setConfigInfo(defaultConfigInfo);
      storage.remove(USER_CONFIG);
      return Promise.resolve('');
    },
    // 接口修改配置
    async updateApiConfigInfo(configInfo: ApiConfigInfo) {
      const [err, resp] = await at(configurationApi.update(configInfo));
      if (err) return false;
      this.setConfigInfo(configInfo);
      return resp;
    },
  },
});

// 需要在设置之外使用
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
