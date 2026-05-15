<template>
  <div class="layout-footer">
    ©2020 - {{ nowYear }}
    <span class="ml-10 mr-5">{{ title }} |</span>
    <a href="https://beian.miit.gov.cn">黔ICP备2021008571号</a>
  </div>
</template>

<script lang="ts" setup>
  import { APP_ENV_CONFIG } from '@/constant';
  import { useDateFormat, useNow } from '@vueuse/core';

  const title = APP_ENV_CONFIG.shortName;

  const nowYear = useDateFormat(useNow(), 'YYYY');
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
    color: $footer-text-color;
    font-size: 14px;
    background: $footer-back-color;
    transition: all 0.2s ease-in-out;

    a {
      color: $footer-text-color;
    }
  }
</style>
