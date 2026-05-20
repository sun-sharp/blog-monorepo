export interface UniUserState {
  token: string;
  info: ApiUserInfo;
  configInfo: ApiConfigInfo;
}

export type UniLockScreenState = {
  isLock: boolean;
  lockTime: number;
};
