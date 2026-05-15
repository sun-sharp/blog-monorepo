import { onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLockScreenStore } from '@/store';
import { PAGE_ENUM } from '@/constant';

// 配置App文件
export const useApp = () => {
  const route = useRoute();
  const useLockScreen = useLockScreenStore();
  const isLock = computed<boolean>(() => useLockScreen.isLock);
  const lockTime = computed(() => useLockScreen.lockTime);

  const loginName = PAGE_ENUM.LOGIN_NAME;

  // 设置锁屏
  let timer: IntervalHandle;
  const timekeeping = () => {
    clearInterval(timer);
    if (route.name === loginName || isLock.value) return;
    // 设置不锁屏
    useLockScreen.setLock(false);
    // 重置锁屏时间
    useLockScreen.setLockTime();
    timer = setInterval(() => {
      // 锁屏倒计时递减
      useLockScreen.setLockTime(lockTime.value - 1);
      if (lockTime.value <= 0) {
        // 设置锁屏
        useLockScreen.setLock(true);
        return clearInterval(timer);
      }
    }, 1000);
  };

  onMounted(() => {
    document.addEventListener('mousedown', timekeeping);
  });

  onUnmounted(() => {
    document.removeEventListener('mousedown', timekeeping);
  });

  return { isLock };
};
