import { defineStore } from 'pinia';
import { IS_LOCK_SCREEN } from '@/enums';
import { storage } from '@/utils';

// 长时间不操作默认锁屏时间
const initTime = 60 * 60;

const isLock = storage.get(IS_LOCK_SCREEN, false);

export type ILockScreenState = {
  isLock: boolean; // 是否锁屏
  lockTime: number;
};

export const useLockScreenStore = defineStore({
  id: 'app-lockScreen',
  state: (): ILockScreenState => ({
    isLock: isLock === true, // 是否锁屏
    lockTime: isLock == 'true' ? initTime : 0,
  }),
  getters: {},
  actions: {
    setLock(payload) {
      this.isLock = payload;
      storage.set(IS_LOCK_SCREEN, this.isLock);
    },
    setLockTime(payload = initTime) {
      this.lockTime = payload;
    },
  },
});
