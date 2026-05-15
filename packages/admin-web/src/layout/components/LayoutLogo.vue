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

<style lang="scss" scoped>
  .layout-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: $header-height;
    overflow: hidden;
    line-height: $header-height;
    white-space: nowrap;

    img {
      width: auto;
      height: 32px;
    }

    .title {
      margin-top: 0;
      margin-bottom: 0;
      margin-left: 5px;
    }
  }
</style>
