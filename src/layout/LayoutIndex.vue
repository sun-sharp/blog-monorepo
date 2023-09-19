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

  const {
    getNavMode,
    getNavTheme,
    // getHeaderSetting,
    getMenuSetting,
    // getMultiTabsSetting,
    // getIsDarkTheme,
    // getFooterSetting,
  } = useSetting();

  const layoutClassName = computed(() => {
    const arr = ['layout-no-sider'];
    // if (!unref(getIsDarkTheme)) {
    //   arr.push('layout-default-background');
    // }
    // const fixFoot = unref(fixedFoot);
    // const isFoot = unref(isFooter);
    // const fixHead = unref(fixedHeader);
    // const fixMulti = unref(fixedMulti);
    // if (fixFoot && isFoot) {
    //   arr.push('layout-fixed--foot');
    // }
    // if (fixHead && !fixMulti) {
    //   arr.push('layout-fixed--head');
    // } else if (fixHead && fixMulti) {
    //   arr.push('layout-fixed--head-tabs');
    // } else if (!fixHead && fixMulti) {
    //   arr.push('layout-fixed--tabs');
    // }
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

  // 菜单主题
  const inverted = computed(() => {
    return ['dark', 'header-dark'].includes(unref(getNavTheme));
  });

  // 标题主题
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
      :inverted="inverted"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <layout-logo :collapsed="collapsed" />
      <layout-menu v-model:collapsed="collapsed" />
    </n-layout-sider>
    <section :class="layoutClassName">
      <header class="lnf-header">
        <layout-header v-model:collapsed="collapsed" :inverted="inverted" />
        <layout-tabs-view v-if="isMultiTabs" />
      </header>

      <main class="lnf-content">
        <transition name="searchView">
          <layout-search v-show="useSearch" v-press-key:q.alt="() => (useSearch = true)" />
        </transition>

        <transition name="searchView">
          <div v-show="!useSearch" v-press-key:escape="() => (useSearch = false)" class="main-view">
            <layout-main />
          </div>
        </transition>
      </main>

      <footer v-if="isFooter" class="lnf-footer">
        <layout-footer />
      </footer>
    </section>
    <!-- <n-layout-content>
      <layout-header v-model:collapsed="collapsed" :inverted="inverted" />
      <transition name="searchView">
        <div v-show="!useSearch" v-press-key:escape="() => (useSearch = false)" class="main-view">
          <layout-main />
        </div>
      </transition>
    </n-layout-content> -->
    <!-- <n-layout :inverted="inverted" :class="layoutClassName">
      <n-layout :inverted="inverted">
        <n-layout-header :inverted="getHeaderInverted">
          <layout-header v-model:collapsed="collapsed" :inverted="inverted" />
        </n-layout-header>
        <n-layout :inverted="inverted">
          <n-layout-header :inverted="getHeaderInverted">
            <layout-tabs-view v-if="isMultiTabs" />
          </n-layout-header>
        <n-layout-content>
          <transition name="searchView">
            <layout-search v-show="useSearch" v-press-key:q.alt="() => (useSearch = true)" />
          </transition>

          <transition name="searchView">
            <div v-show="!useSearch" v-press-key:escape="() => (useSearch = false)">
              <layout-main />
            </div>
          </transition>
        </n-layout-content>
        </n-layout>
      </n-layout>
      <n-layout-footer v-if="isFooter">
        <layout-footer />
      </n-layout-footer>
      <n-back-top :right="70" :bottom="70" />
    </n-layout> -->
  </n-layout>
</template>

<style lang="scss" scoped>
  .layout {
    height: 100vh;

    // &.layout-default-background {
    //   background-color: #f5f7f9;
    // }

    &-sider {
      min-height: 100vh;
      box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
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
      background-color: #fc0000;
    }

    .lnf-footer {
      width: 100%;
    }

    .main-view {
      padding: 10px;
    }
  }
</style>
