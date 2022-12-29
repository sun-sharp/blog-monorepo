<template>
  <app-provider v-if="!isLock">
    <router-view />
  </app-provider>

  <transition v-if="isLock && $route.name !== 'login'" name="slide-up">
    <app-lock-screen />
  </transition>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted, computed } from 'vue';
  import AppLockScreen from '@/components/app/lock-screen/app-lock-screen.vue';
  import AppProvider from '@/components/app/provider/app-provider.vue';
  import { useRoute } from 'vue-router';
  import { useLockScreenStore } from '@/store';

  const route = useRoute();
  const useLockScreen = useLockScreenStore();
  const isLock = computed<boolean>(() => useLockScreen.isLock);
  const lockTime = computed(() => useLockScreen.lockTime);

  // 设置锁屏
  let timer: NodeJS.Timeout;
  const timekeeping = () => {
    clearInterval(timer);
    if (route.name == 'login' || isLock.value) return;
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
</script>

<style lang="scss">
  @import 'styles/index.scss';
</style>
