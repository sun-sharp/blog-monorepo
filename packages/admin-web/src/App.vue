<script lang="ts" setup>
  import AppLockScreen from '@/components/app/lock-screen/AppLockScreen.vue';
  import AppProvider from '@/components/app/provider/AppProvider.vue';
  import { useApp } from '@/hooks';

  const { isLock } = useApp();
</script>

<template>
  <app-provider>
    <transition v-if="isLock" name="slide-up">
      <app-lock-screen />
    </transition>
    <router-view v-else />
  </app-provider>
</template>

<style lang="scss">
  @use 'styles/index';
</style>
