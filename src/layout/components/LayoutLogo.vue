<script lang="ts" setup>
  import { APP_ENV_CONFIG } from '@/constant';

  defineProps({
    collapsed: {
      type: Boolean,
    },
  });

  const title = APP_ENV_CONFIG.shortName;
</script>

<template>
  <div class="layout-logo">
    <img src="~@/assets/images/common/logo.png" alt="" :class="{ 'mr-2': !collapsed }" />
    <h2 v-show="!collapsed" class="title">{{ title }}</h2>
  </div>
</template>

<style lang="scss">
  .layout-logo {
    display: block;
  }
</style>
