<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  import { useSetting } from '@/hooks';
  import LayoutLogo from '@/layout/components/layout-logo.vue';
  import LayoutMenu from '@/layout/components/layout-menu.vue';
  import LayoutHeader from '@/layout/components/layout-header.vue';
  import LayoutTabsView from '@/layout/components/layout-tags-view.vue';
  import LayoutMain from '@/layout/components/layout-main.vue';
  import LayoutFooter from './components/layout-footer.vue';

  const { getNavMode, getNavTheme, getHeaderSetting, getMenuSetting, getMultiTabsSetting, getIsDarkTheme, getShowFooter } = useSetting();

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

  // 菜单位置
  const getMenuLocation = computed(() => {
    return 'left';
  });

  // 菜单主题
  const inverted = computed(() => {
    return ['dark', 'header-dark'].includes(unref(getNavTheme));
  });

  // 标题主题
  const getHeaderInverted = computed(() => {
    const navTheme = unref(getNavTheme);
    return ['light', 'header-dark'].includes(navTheme) ? unref(inverted) : !unref(inverted);
  });

  // 头部固定
  const fixedHeader = computed(() => {
    const { fixed } = unref(getHeaderSetting);
    return fixed ? 'static' : 'static';
  });

  // 标签栏和内容固定
  const fixedCont = computed(() => {
    const { fixed } = unref(getHeaderSetting);
    return fixed ? 'static' : 'static';
  });

  // 标签栏固定
  const fixedMulti = computed(() => {
    const { fixed } = unref(getHeaderSetting);
    return fixed ? 'static' : 'static';
  });

  // 显示标签栏
  const isMultiTabs = computed(() => {
    return unref(getMultiTabsSetting).show;
  });

  // 内容固定
  const fixedMain = computed(() => {
    const { fixed } = unref(getHeaderSetting);
    return fixed ? 'static' : 'static';
  });

  // 底部固定
  const fixedFoot = computed(() => {
    return 'absolute';
  });

  // 展示底部
  const showFooter = computed(() => {
    return unref(getShowFooter);
  });
</script>

<template>
  <n-layout class="layout" :class="{ 'layout-default-background': !getIsDarkTheme }" has-sider>
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
      <layout-menu v-model:collapsed="collapsed" v-model:location="getMenuLocation" />
    </n-layout-sider>
    <n-layout :inverted="inverted" class="layout-no-sider">
      <n-layout-header :inverted="getHeaderInverted" :position="fixedHeader">
        <layout-header v-model:collapsed="collapsed" :inverted="inverted" />
      </n-layout-header>
      <n-layout :inverted="inverted" :position="fixedCont" class="layout-content" :class="{ 'lc-foot': fixedFoot === 'absolute' }">
        <n-layout-header :inverted="getHeaderInverted" :position="fixedMulti">
          <layout-tabs-view v-if="isMultiTabs" />
        </n-layout-header>
        <n-layout-content class="layout-content-main" :position="fixedMain">
          <div class="main-view">
            <layout-main />
          </div>
        </n-layout-content>
      </n-layout>
      <n-layout-footer v-if="showFooter" :position="fixedFoot" class="layout-footer">
        <layout-footer />
      </n-layout-footer>
      <n-back-top :right="70" :bottom="70" />
    </n-layout>
  </n-layout>
</template>

<style lang="scss" scoped>
  .layout {
    height: 100vh;

    &.layout-default-background {
      background-color: #f5f7f9;
    }

    &-no-sider {
      background-color: transparent;
    }

    &-sider {
      min-height: 100vh;
      box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
      transition: all 0.2s ease-in-out;
    }

    &-content {
      background-color: transparent;

      &.lc-foot {
        padding-bottom: $footer-height;
      }

      &-main {
        background-color: transparent;
        // height: calc(100% - $tabs-view-height);
      }
    }

    &-footer {
      z-index: 3000;
    }

    .main-view {
      padding: 10px 10px 10px 10px;
    }
  }
</style>
