<template>
  <n-layout class="layout" :position="fixedMenu" has-sider>
    <n-layout-sider
      v-if="isMixMenuNoneSub && (navMode === 'vertical' || navMode === 'horizontal-mix')"
      class="layout-sider"
      show-trigger="bar"
      collapse-mode="width"
      :collapsed-width="64"
      :position="fixedMenu"
      :collapsed="collapsed"
      :width="leftMenuWidth"
      :native-scrollbar="false"
      :inverted="inverted"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <layout-logo :collapsed="collapsed" />
      <layout-menu v-model:collapsed="collapsed" v-model:location="getMenuLocation" />
    </n-layout-sider>

    <n-layout :inverted="inverted">
      <n-layout-header :inverted="getHeaderInverted" :position="fixedHeader">
        <layout-header v-model:collapsed="collapsed" :inverted="inverted" />
      </n-layout-header>

      <n-layout-content class="layout-content" :class="{ 'layout-default-background': getIsDarkTheme === false }">
        <div
          class="layout-content-main"
          :class="{
            'layout-content-main-fix': fixedMulti,
            'fluid-header': fixedHeader === 'static',
          }"
        >
          <layout-tabs-view v-if="isMultiTabs" v-model:collapsed="collapsed" />
          <div
            class="main-view"
            :class="{
              'main-view-fix': fixedMulti,
              noMultiTabs: !isMultiTabs,
              'mt-3': !isMultiTabs,
            }"
          >
            <layout-main />
          </div>
        </div>
      </n-layout-content>
      <n-layout-footer :position="'absolute'" :bottom="0">
        <layout-footer />
      </n-layout-footer>
      <n-back-top :right="100" />
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
  import { ref, unref, computed, onMounted } from 'vue';
  import LayoutLogo from '@/layout/components/layout-logo.vue';
  import LayoutMenu from '@/layout/components/layout-menu.vue';
  import LayoutHeader from '@/layout/components/layout-header.vue';
  import LayoutTabsView from '@/layout/components/layout-tags-view.vue';
  import LayoutMain from '@/layout/components/layout-main.vue';
  import { useSetting } from '@/hooks';
  import { useRoute } from 'vue-router';
  import LayoutFooter from './components/layout-footer.vue';

  const { getNavMode, getNavTheme, getHeaderSetting, getMenuSetting, getMultiTabsSetting, getIsDarkTheme } = useSetting();

  const navMode = getNavMode;

  const collapsed = ref<boolean>(false);

  const fixedHeader = computed(() => {
    const { fixed } = unref(getHeaderSetting);
    return fixed ? 'absolute' : 'static';
  });

  const isMixMenuNoneSub = computed(() => {
    const mixMenu = unref(getMenuSetting).mixMenu;
    const currentRoute = useRoute();
    if (unref(navMode) != 'horizontal-mix') return true;
    if (unref(navMode) === 'horizontal-mix' && mixMenu && currentRoute.meta.isRoot) {
      return false;
    }
    return true;
  });

  const fixedMenu = computed(() => {
    const { fixed } = unref(getHeaderSetting);
    return fixed ? 'absolute' : 'static';
  });

  const isMultiTabs = computed(() => {
    return unref(getMultiTabsSetting).show;
  });

  const fixedMulti = computed(() => {
    return unref(getMultiTabsSetting).fixed;
  });

  const inverted = computed(() => {
    return ['dark', 'header-dark'].includes(unref(getNavTheme));
  });

  const getHeaderInverted = computed(() => {
    const navTheme = unref(getNavTheme);
    return ['light', 'header-dark'].includes(navTheme) ? unref(inverted) : !unref(inverted);
  });

  const leftMenuWidth = computed(() => {
    const { minMenuWidth, menuWidth } = unref(getMenuSetting);
    return collapsed.value ? minMenuWidth : menuWidth;
  });

  const getMenuLocation = computed(() => {
    return 'left';
  });

  const watchWidth = () => {
    const Width = document.body.clientWidth;
    if (Width <= 950) {
      collapsed.value = true;
    } else collapsed.value = false;
  };

  onMounted(() => {
    window.addEventListener('resize', watchWidth);
  });
</script>

<style lang="scss" scoped>
  .layout {
    display: flex;
    flex-direction: row;
    flex: auto;

    &-default-background {
      background: #f5f7f9;
    }

    .layout-sider {
      min-height: 100vh;
      box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
      position: relative;
      z-index: 13;
      transition: all 0.2s ease-in-out;
    }

    .layout-sider-fix {
      position: fixed;
      top: 0;
      left: 0;
    }

    .ant-layout {
      overflow: hidden;
    }

    .layout-right-fix {
      overflow-x: hidden;
      padding-left: 200px;
      min-height: 100vh;
      transition: all 0.2s ease-in-out;
    }

    .layout-content {
      flex: auto;
      min-height: 100vh;
    }

    .n-layout-header.n-layout-header--absolute-positioned {
      z-index: 11;
    }

    .n-layout-footer.n-layout-footer--absolute-positioned {
      z-index: 11;
    }
  }

  .layout-content-main {
    margin: 0 10px 10px;
    position: relative;
    padding-top: $header-height;
    padding-bottom: $footer-height;
  }

  .layout-content-main-fix {
    padding-top: $header-height;
    padding-bottom: $footer-height;
  }

  .fluid-header {
    padding-top: 0;
  }

  .main-view-fix {
    padding-top: 44px;
  }

  .noMultiTabs {
    padding-top: 0;
  }
</style>
