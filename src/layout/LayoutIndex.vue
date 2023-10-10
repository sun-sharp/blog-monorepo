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

  const { getNavMode, getHeadFixed, getTabsViewShow, getTabsViewFixed, getFooterShow, getFooterFixed } = useSetting();

  // 除去右侧
  const noSiderClassName = computed(() => {
    const arr = ['layout-no-sider'];
    return arr;
  });

  // 顶部
  const noSiderHeadClassName = computed(() => {
    const arr = ['lnf-header'];
    const headFixed = unref(getHeadFixed);
    const tabsViewShow = unref(getTabsViewShow);
    const tabsViewFixed = unref(getTabsViewFixed);
    if (headFixed && tabsViewFixed && tabsViewShow) {
      arr.push('head_tabs-view');
    } else if (headFixed) {
      arr.push('head');
    } else if (tabsViewFixed) {
      arr.push('tabs-view');
    }
    return arr;
  });

  // 顶部固定
  const lnfContHeadClassName = computed(() => {
    const arr = [];
    const headFixed = unref(getHeadFixed);
    if (headFixed) {
      arr.push('head-fixed');
    }
    return arr;
  });

  // 标签页固定
  const lnfContTabsViewClassName = computed(() => {
    const arr = [];
    const headFixed = unref(getHeadFixed);
    const tabsViewFixed = unref(getTabsViewFixed);
    if (tabsViewFixed) {
      arr.push('tabs-view-fixed');
    }
    if (headFixed) {
      arr.push('has-head');
    }
    return arr;
  });

  // 页脚
  const noSiderFootClassName = computed(() => {
    const arr = ['lnf-footer'];
    const footerFixed = unref(getFooterFixed);
    const footerShow = unref(getFooterShow);
    if (footerFixed && footerShow) {
      arr.push('footer');
    }
    return arr;
  });

  // 页脚固定
  const lnfContFootClassName = computed(() => {
    const arr = [];
    const footerFixed = unref(getFooterFixed);
    if (footerFixed) {
      arr.push('foot-fixed');
    }
    return arr;
  });

  // 菜单是否折叠
  const collapsed = ref<boolean>(false);

  // 菜单是否展示
  const menuIsShow = computed(() => {
    const navMode = unref(getNavMode);
    if (navMode === 'horizontal') {
      return false;
    }
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
    <section :class="noSiderClassName">
      <header :class="noSiderHeadClassName"></header>

      <main class="lnf-cont">
        <div :class="lnfContHeadClassName">
          <layout-header v-model:collapsed="collapsed" />
        </div>

        <div v-if="getTabsViewShow" :class="lnfContTabsViewClassName">
          <layout-tabs-view />
        </div>

        <transition name="search-view">
          <layout-search v-show="useSearch" v-press-key:q.alt="() => (useSearch = true)" />
        </transition>

        <transition name="search-view">
          <div v-show="!useSearch" v-press-key:escape="() => (useSearch = false)" class="main-view">
            <layout-main />
          </div>
        </transition>

        <div v-if="getFooterShow" :class="lnfContFootClassName">
          <layout-footer />
        </div>

        <n-back-top :right="70" :bottom="70" />
      </main>

      <footer :class="noSiderFootClassName"></footer>
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
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .lnf-header {
      width: 100%;

      &.head {
        height: $header-height;
      }

      &.tabs-view {
        height: $tabs-view-height;
      }

      &.head_tabs-view {
        height: calc($header-height + $tabs-view-height);
      }
    }

    .lnf-cont {
      flex: 1;
      width: 100%;
      height: 0;
      overflow-y: auto;
      background-color: $background-color;

      .head-fixed {
        position: absolute;
        top: 0;
        width: 100%;
      }

      .tabs-view-fixed {
        position: absolute;
        top: 0;
        width: 100%;

        &.has-head {
          top: $header-height;
        }
      }

      .foot-fixed {
        position: absolute;
        bottom: 0;
        width: 100%;
      }
    }

    .lnf-footer {
      width: 100%;
      color: $footer-text-color;
      background-color: $footer-back-color;

      &.footer {
        height: $footer-height;
      }
    }

    .main-view {
      padding: 10px;
    }
  }
</style>
