<template>
  <div class="layout-logo">
    <img src="~@/assets/images/logo.png" alt="" :class="{ 'mr-2': !collapsed }" />
    <h2 v-show="!collapsed" class="title">{{ title }}</h2>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'LayoutLogo',
    props: {
      collapsed: {
        type: Boolean,
      },
    },
    setup() {
      const title = import.meta.env.VITE_APP_SHORT_NAME;
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
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;

    img {
      width: auto;
      height: 32px;
    }

    .title {
      margin-bottom: 0;
      margin-top: 0;
      margin-left: 5px;
    }
  }
</style>
