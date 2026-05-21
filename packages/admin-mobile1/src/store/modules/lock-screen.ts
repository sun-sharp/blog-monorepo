import { defineStore } from 'pinia';
import { IS_LOCK_SCREEN } from '@/constant';
import { storage } from '@/utils/storage-adapter';

const initTime = 60 * 60;
const isLock: boolean = storage.get(IS_LOCK_SCREEN, false);

interface LockScreenState { isLock: boolean; lockTime: number; }

export const useLockScreenStore = defineStore({
  id: 'app-lockScreen',
  state: (): LockScreenState => ({ isLock: isLock, lockTime: isLock ? initTime : 0 }),
  actions: {
    setLock(payload: boolean) { this.isLock = payload; storage.set(IS_LOCK_SCREEN, this.isLock); },
    setLockTime(payload = initTime) { this.lockTime = payload; },
  },
});

export function useLockScreenStoreWidthOut() { return useLockScreenStore(); }
