<script lang="ts" setup>
  import { getAppEnvConfig } from '@/utils/env';

  defineProps({
    collapsed: {
      type: Boolean,
    },
  });

  const appEnvConfig = getAppEnvConfig();
  const title = appEnvConfig.shortName;
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
