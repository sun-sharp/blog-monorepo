<template>
  <div class="layout-footer">
    ©2020
    <span class="ml-10">Mr.Yang |</span>
    <a href="https://beian.miit.gov.cn">黔ICP备2021008571号</a>
  </div>
</template>

<script>
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
  .layout-footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    line-height: 44px;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    text-align: center;
    background: #333;
    color: #a5a4a4;

    a {
      color: #a5a4a4;
    }
  }
</style>
