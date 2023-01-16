import at from 'await-to-js';
import { defineStore } from 'pinia';
import { storage } from '@/utils';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_LOCK_SCREEN, ResultEnum, USER_CONFIG } from '@/constant';
import { capitalApi, configurationApi, userApi } from '@/api';
import { getAppEnvConfig } from '@/utils/env';
import { CLoginFormState, CUserState, CUserInfo, CUserConfigInfo } from '/#/config';

const appEnvConfig = getAppEnvConfig();

// 默认用户信息
const defaultUserInfo: CUserInfo = {
  avatar: '',
  loginDate: '',
  nickname: '',
  roleCode: '',
  userId: '',
  username: '',
};

// 默认配置信息
const defaultConfigInfo: CUserConfigInfo = {
  // 系统主题色
  appTheme: '#2d8cf0',
  // 面包屑
  crumbsSetting: {
    // 是否显示
    show: true,
    // 显示图标
    showIcon: false,
  },
  // 顶部
  headerSetting: {
    // 固定顶部
    fixed: true,
    // 显示重载按钮
    isReload: true,
  },
  // 深色主题
  isDarkTheme: false,
  // 是否开启路由动画
  isPageAnimate: true,
  // 菜单
  menuSetting: {
    // 默认展开
    collapsed: false,
    // 固定菜单
    fixed: true,
    // 菜单宽度
    menuWidth: 200,
    // 最小宽度
    minMenuWidth: 64,
    // 分割菜单
    mixMenu: false,
  },
  // 多标签
  multiTabsSetting: {
    // 是否显示
    show: true,
    // 固定多标签
    fixed: true,
  },
  // 导航模式 vertical 左侧菜单模式 horizontal 顶部菜单模式
  navMode: 'vertical',
  // 导航风格 dark 暗色侧边栏 light 白色侧边栏 header-dark 暗色顶栏
  navTheme: 'dark',
  // 路由动画类型
  pageAnimateType: 'zoom-fade',
  // 页脚
  showFooter: true,
};

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): CUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    info: storage.get(CURRENT_USER, defaultUserInfo),
    configInfo: storage.get(USER_CONFIG, defaultConfigInfo),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getCompleteToken(): string {
      const { tokenHead } = appEnvConfig;
      return tokenHead ? tokenHead + this.token : this.token;
    },
    getUserInfo(): CUserInfo {
      return this.info;
    },
    getConfigInfo(): CUserConfigInfo {
      return this.configInfo;
    },
  },
  actions: {
    // 设置token
    setToken(token: string) {
      this.token = token;
    },
    // 设置用户信息
    setUserInfo(info: CUserInfo) {
      this.info = info;
    },
    // 设置配置信息
    setConfigInfo(configInfo: CUserConfigInfo) {
      this.configInfo = configInfo;
    },
    // 登录
    async login(loginForm: CLoginFormState) {
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
      const self = this;
      const [err, resp] = await at(userApi.getUserInfo());
      if (err) return false;
      storage.set(CURRENT_USER, resp);
      self.setUserInfo(resp);
      return resp;
    },
    // 获取用户配置
    async GetConfigInfo() {
      const self = this;
      const [err, resp] = await at(configurationApi.getConfigInfo());
      if (err) return false;
      storage.set(USER_CONFIG, resp);
      self.setConfigInfo(resp);
      return resp;
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
    async updateApiConfigInfo(configInfo: CUserConfigInfo) {
      const [err, resp] = await at(configurationApi.update(configInfo));
      if (err) return false;
      storage.set(USER_CONFIG, configInfo);
      this.setConfigInfo(configInfo);
      return resp;
    },
  },
});

// 需要在设置之外使用
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
