<template>
  <div class="layout-footer">
    ©2020
    <span class="ml-10 mr-5">Mr.Yang |</span>
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
    height: $footer-height;
    font-size: 14px;
    background: #333;
    color: #a5a4a4;
    padding: 0;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    transition: all 0.2s ease-in-out;
    z-index: 11;

    a {
      color: #a5a4a4;
    }
  }
</style>
