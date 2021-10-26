<template>
  <n-config-provider v-if="!isLock" :locale="zhCN" :theme="getDarkTheme" :theme-overrides="getThemeOverrides" :date-locale="dateZhCN">
    <app-provider>
      <router-view />
    </app-provider>
  </n-config-provider>

  <transition v-if="isLock && $route.name !== 'login'" name="slide-up">
    <lock-screen />
  </transition>
</template>

<script lang="ts" setup>
  import { computed, onMounted, onUnmounted } from 'vue';
  import { zhCN, dateZhCN, darkTheme } from 'naive-ui';
  import { LockScreen } from '@/components/LockScreen';
  import { AppProvider } from '@/components/Application';
  import { useLockScreenStore } from '@/store/modules/lockScreen';
  import { useRoute } from 'vue-router';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  import { lighten } from '@/utils/index';

  const route = useRoute();
  const useLockScreen = useLockScreenStore();
  const designStore = useDesignSettingStore();
  const isLock = computed(() => useLockScreen.isLock);
  const lockTime = computed(() => useLockScreen.lockTime);

  /**
   * @type import('naive-ui').GlobalThemeOverrides 设置主题样式
   */
  const getThemeOverrides = computed(() => {
    const appTheme = designStore.appTheme;
    const lightenStr = lighten(designStore.appTheme, 6);
    return {
      common: {
        primaryColor: appTheme,
        primaryColorHover: lightenStr,
        primaryColorPressed: lightenStr,
      },
      LoadingBar: {
        colorLoading: appTheme,
      },
    };
  });

  // 获取主题样式
  const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined));

  // 设置锁屏
  let timer;
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
