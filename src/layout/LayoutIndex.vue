<script lang="ts" setup>
  import { computed, ref, unref } from 'vue';
  import { useSearch, useSetting } from '@/hooks';
  // import LayoutLogo from '@/layout/components/layout-logo.vue';
  // import LayoutMenu from '@/layout/components/layout-menu.vue';
  // import LayoutHeader from '@/layout/components/layout-header.vue';
  // import LayoutTabsView from '@/layout/components/layout-tags-view.vue';
  import LayoutMain from '@/layout/components/layout-main.vue';
  import LayoutFooter from '@/layout/components/layout-footer.vue';
  // import LayoutSearch from '@/layout/components/layout-search.vue';

  const { getNavMode, getNavTheme, getHeaderSetting, getMenuSetting, getMultiTabsSetting, getIsDarkTheme, getFooterSetting } = useSetting();

  const layoutClassName = computed(() => {
    const arr = ['layout-no-sider'];
    if (!unref(getIsDarkTheme)) {
      arr.push('layout-default-background');
    }
    const fixFoot = unref(fixedFoot);
    const isFoot = unref(isFooter);
    const fixHead = unref(fixedHeader);
    const fixMulti = unref(fixedMulti);
    if (fixFoot && isFoot) {
      arr.push('layout-fixed--foot');
    }
    if (fixHead && !fixMulti) {
      arr.push('layout-fixed--head');
    } else if (fixHead && fixMulti) {
      arr.push('layout-fixed--head-tabs');
    } else if (!fixHead && fixMulti) {
      arr.push('layout-fixed--tabs');
    }
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
  const getHeaderInverted = computed(() => {
    const navTheme = unref(getNavTheme);
    return ['light', 'header-dark'].includes(navTheme) ? unref(inverted) : !unref(inverted);
  });

  // 头部固定
  const fixedHeader = computed(() => {
    const { fixed } = unref(getHeaderSetting);
    return fixed;
  });

  // 标签栏固定
  const fixedMulti = computed(() => {
    const { fixed } = unref(getMultiTabsSetting);
    return fixed;
  });

  // 显示标签栏
  // const isMultiTabs = computed(() => {
  //   return unref(getMultiTabsSetting).show;
  // });

  // 底部固定
  const fixedFoot = computed(() => {
    const { fixed } = unref(getFooterSetting);
    return fixed;
  });

  // 展示底部
  const isFooter = computed(() => {
    return unref(getFooterSetting).show;
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
      <!-- <layout-logo :collapsed="collapsed" /> -->
      <!-- <layout-menu v-model:collapsed="collapsed" /> -->
    </n-layout-sider>
    <n-layout :inverted="inverted" :class="layoutClassName">
      <n-layout :inverted="inverted" class="layout-no-foot">
        <n-layout-header :inverted="getHeaderInverted" class="lnf-header" :class="{ fixed: fixedHeader }">
          <!-- <layout-header v-model:collapsed="collapsed" :inverted="inverted" /> -->
        </n-layout-header>
        <n-layout :inverted="inverted" class="layout-content">
          <n-layout-header :inverted="getHeaderInverted" class="lc-tabs" :class="{ fixed: fixedMulti, 'head-no-fixed': !fixedHeader }">
            <!-- <layout-tabs-view v-if="isMultiTabs" /> -->
          </n-layout-header>
          <n-layout-content class="layout-content-main">
            <!-- <transition name="searchView">
              <layout-search v-show="useSearch" v-press-key:q.alt="() => (useSearch = true)" />
            </transition> -->

            <transition name="searchView">
              <div v-show="!useSearch" v-press-key:escape="() => (useSearch = false)" class="main-view">
                <layout-main />
              </div>
            </transition>
          </n-layout-content>
        </n-layout>
      </n-layout>
      <n-layout-footer v-if="isFooter" id="appLayoutFoot" class="lns-footer" :class="{ fixed: fixedFoot }">
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

    &-sider {
      min-height: 100vh;
      box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
      transition: all 0.2s ease-in-out;
    }

    &-no-sider {
      background-color: transparent;

      &.layout-fixed {
        &--foot {
          height: calc(100vh - $footer-height);
        }

        &--head {
          padding-top: $header-height;
        }

        &--head-tabs {
          padding-top: $header-height + $tabs-view-height;
        }

        &--tabs {
          padding-top: $tabs-view-height;
        }
      }
    }

    &-no-foot {
      height: 100%;
      background-color: transparent;
    }

    &-content {
      height: 100%;
      background-color: transparent;

      &-main {
        height: 100%;
        background-color: transparent;
      }
    }

    .lns-footer {
      &.fixed {
        position: fixed;
        bottom: 0;
        z-index: 1500;
        width: fill-available;
        width: available;
      }
    }

    .lnf-header {
      &.fixed {
        position: fixed;
        top: 0;
        z-index: 1500;
        width: fill-available;
        width: available;
      }
    }

    .lc-tabs {
      &.fixed {
        position: fixed;
        top: $header-height;
        z-index: 1500;
        width: fill-available;
        width: available;
      }

      &.head-no-fixed {
        position: fixed;
        top: 0;
      }
    }

    .main-view {
      padding: 10px;
    }
  }
</style>
