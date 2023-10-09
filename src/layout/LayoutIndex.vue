<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  import { useSearch, useSetting } from '@/hooks';
  import LayoutLogo from '@/layout/components/LayoutLogo.vue';
  import LayoutMenu from '@/layout/components/LayoutMenu.vue';
  import LayoutHeader from '@/layout/components/LayoutHeader.vue';
  import LayoutTabsView from '@/layout/components/LayoutTagsView.vue';
  import LayoutMain from '@/layout/components/LayoutMain.vue';
  import LayoutFooter from '@/layout/components/LayoutFooter.vue';
  import LayoutSearch from '@/layout/components/LayoutSearch.vue';

  const { getNavMode, getMenuSetting } = useSetting();

  const layoutClassName = computed(() => {
    const arr = ['layout-no-sider'];
    return arr;
  });

  // 菜单是否折叠
  const collapsed = ref<boolean>(false);

  // 菜单是否展示
  const menuIsShow = computed(() => {
    const mixMenu = unref(getMenuSetting).mixMenu;
    const navMode = unref(getNavMode);
    if (!mixMenu && navMode === 'horizontal') {
      return false;
    }
    return true;
  });

  // 侧边栏主题
  // const siderInverted = computed(() => {
  //   const siderIsDark = unref(getSiderIsDark);
  //   return siderIsDark;
  // });

  // 顶部样式
  // const headerStyle = computed(() => {
  //   const topBarStyle = unref(getTopBarStyle) === 'dark';
  //   const backColor = topBarStyle ? '#001428' : '#fff';
  //   const textColor = topBarStyle ? '#fff' : '#333639';
  //   return {
  //     '--app-header-back-color': backColor,
  //     '--app-header-text-color': textColor,
  //   };
  // });
  // const getHeaderInverted = computed(() => {
  //   const navTheme = unref(getNavTheme);
  //   return ['light', 'header-dark'].includes(navTheme) ? unref(inverted) : !unref(inverted);
  // });

  // 头部固定
  // const fixedHeader = computed(() => {
  //   const { fixed } = unref(getHeaderSetting);
  //   return fixed;
  // });

  // 标签栏固定
  // const fixedMulti = computed(() => {
  //   const { fixed } = unref(getMultiTabsSetting);
  //   return fixed;
  // });

  // 显示标签栏
  const isMultiTabs = computed(() => {
    // return unref(getMultiTabsSetting).show;
    return true;
  });

  // 底部固定
  // const fixedFoot = computed(() => {
  //   const { fixed } = unref(getFooterSetting);
  //   return fixed;
  // });

  // 展示底部
  const isFooter = computed(() => {
    // return unref(getFooterSetting).show;
    return true;
  });
</script>

<template>
  <n-layout id="appLayout" class="layout" has-sider>
    <n-layout-sider
      v-if="menuIsShow"
      class="layout-sider"
      show-trigger="bar"
      collapse-mode="width"
      :collapsed-width="64"
      :collapsed="collapsed"
      :native-scrollbar="false"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <layout-logo :collapsed="collapsed" />
      <layout-menu v-model:collapsed="collapsed" :inverted="false" />
    </n-layout-sider>
    <section :class="layoutClassName">
      <n-layout-header class="lnf-header">
        <layout-header v-model:collapsed="collapsed" />
        <layout-tabs-view v-if="isMultiTabs" />
      </n-layout-header>

      <main class="lnf-content">
        <transition name="searchView">
          <layout-search v-show="useSearch" v-press-key:q.alt="() => (useSearch = true)" />
        </transition>

        <transition name="searchView">
          <div v-show="!useSearch" v-press-key:escape="() => (useSearch = false)" class="main-view">
            <layout-main />
          </div>
        </transition>

        <n-back-top :right="70" :bottom="70" />
      </main>

      <footer v-if="isFooter" class="lnf-footer">
        <layout-footer />
      </footer>
    </section>
  </n-layout>
</template>

<style lang="scss" scoped>
  .layout {
    height: 100vh;

    &-sider {
      min-height: 100vh;
      color: $sider-text-color;
      background-color: $sider-back-color;
      transition: all 0.2s ease-in-out;
    }

    &-no-sider {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .lnf-header {
      width: 100%;
    }

    .lnf-content {
      flex: 1;
      width: 100%;
      height: 0;
      overflow-y: auto;
      background-color: $background-color;
    }

    .lnf-footer {
      width: 100%;
      color: $footer-text-color;
      background-color: $footer-back-color;
    }

    .main-view {
      padding: 10px;
    }
  }
</style>
