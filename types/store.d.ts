import { LoadingBarApiInjection } from 'naive-ui/es/loading-bar/src/LoadingBarProvider';
import { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider';
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';

// 用户全局配置
export interface UserState {
  token: string;
  info: CUserInfo;
  // configInfo: CUserConfigInfo;
}

export type LockScreenState = {
  isLock: boolean; // 是否锁屏
  lockTime: number;
};

// 全局属性配置
export interface ProviderState {
  loading?: LoadingBarApiInjection;
  dialog?: DialogApiInjection;
  message?: MessageApiInjection;
}
