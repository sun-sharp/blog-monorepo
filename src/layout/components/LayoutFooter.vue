<template>
  <div class="layout-footer">
    ©2020
    <span class="ml-10 mr-5">{{ title }} |</span>
    <a href="https://beian.miit.gov.cn">黔ICP备2021008571号</a>
  </div>
</template>

<script lang="ts" setup>
  import { APP_ENV_CONFIG } from '@/constant';

  const title = APP_ENV_CONFIG.shortName;
</script>

<style lang="scss" scoped>
  .layout-footer {
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: $footer-height;
    padding: 0;
    color: #a5a4a4;
    font-size: 14px;
    background: #333;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    transition: all 0.2s ease-in-out;

    a {
      color: #a5a4a4;
    }
  }
</style>
