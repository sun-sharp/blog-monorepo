import { defineStore } from 'pinia';
import { IS_LOCK_SCREEN } from '@/constant';
import { storage } from '@/utils';
import { store } from '@/store';
import { LockScreenState } from '/#/store';

// 长时间不操作默认锁屏时间
const initTime = 60 * 60;

const isLock: boolean = storage.get(IS_LOCK_SCREEN, false);

export const useLockScreenStore = defineStore({
  id: 'app-lockScreen',
  state: (): LockScreenState => ({
    isLock: isLock, // 是否锁屏
    lockTime: isLock ? initTime : 0,
  }),
  getters: {},
  actions: {
    setLock(payload: boolean) {
      this.isLock = payload;
      storage.set(IS_LOCK_SCREEN, this.isLock);
    },
    setLockTime(payload = initTime) {
      this.lockTime = payload;
    },
  },
});

// 需要在设置之外使用
export function useLockScreenStoreWidthOut() {
  return useLockScreenStore(store);
}
