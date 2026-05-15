<script lang="ts" setup>
  import LayoutLogo from '@/layout/components/LayoutLogo.vue';
  import LayoutMenu from '@/layout/components/LayoutMenu.vue';
  import LayoutHeader from '@/layout/components/LayoutHeader.vue';
  import LayoutTabsView from '@/layout/components/LayoutTagsView.vue';
  import LayoutMain from '@/layout/components/LayoutMain.vue';
  import LayoutFooter from '@/layout/components/LayoutFooter.vue';
  import LayoutSearch from '@/layout/components/LayoutSearch.vue';
  import { useLayoutIndex } from './hooks/useLayoutIndex';

  const {
    lnfContRef,
    useSearch,
    noSiderClassName,
    noSiderHeadClassName,
    lnfContHeadClassName,
    lnfContTabsViewClassName,
    noSiderFootClassName,
    lnfContFootClassName,
    siderThemeOverrides,
    collapsed,
    menuIsShow,
    tabsViewShow,
    footerShow,
  } = useLayoutIndex();
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
      @expand="collapsed = false">
      <n-config-provider :theme-overrides="siderThemeOverrides">
        <layout-logo class="layout-sider__logo" :collapsed="collapsed" />
        <layout-menu v-model:collapsed="collapsed" class="layout-sider__menu" :inverted="false" />
      </n-config-provider>
    </n-layout-sider>
    <section :class="noSiderClassName">
      <header :class="noSiderHeadClassName"></header>

      <main ref="lnfContRef" class="lnf-cont">
        <div :class="lnfContHeadClassName">
          <layout-header v-model:collapsed="collapsed" />
        </div>

        <div v-if="tabsViewShow" :class="lnfContTabsViewClassName">
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

        <div v-if="footerShow" :class="lnfContFootClassName">
          <layout-footer />
        </div>

        <!-- <n-back-top :right="50" :bottom="5" /> -->
      </main>

      <footer :class="noSiderFootClassName"></footer>
    </section>
  </n-layout>
</template>

<style lang="scss" scoped>
  .layout {
    height: 100vh;

    &-sider {
      position: relative;
      min-height: 100vh;
      color: $sider-text-color;
      background-color: $sider-back-color;
      transition: all 0.2s ease-in-out;

      &__logo {
        position: absolute;
        top: 0;
        z-index: 10;
        width: 100%;
        background-color: $sider-back-color;
      }

      &__menu {
        padding-top: $header-height;
      }
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
      padding: $main-view-padding;
    }
  }
</style>
