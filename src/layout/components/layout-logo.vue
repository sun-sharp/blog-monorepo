<template>
  <div class="layout-logo">
    <img src="~@/assets/images/common/logo.png" alt="" :class="{ 'mr-2': !collapsed }" />
    <h2 v-show="!collapsed" class="title">{{ title }}</h2>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { getAppEnvConfig } from '@/utils/env';

  export default defineComponent({
    name: 'LayoutLogo',
    props: {
      collapsed: {
        type: Boolean,
      },
    },
    setup() {
      const appEnvConfig = getAppEnvConfig();
      const title = appEnvConfig.shortName;
      return {
        title,
      };
    },
  });
</script>

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
