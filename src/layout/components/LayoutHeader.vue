<script lang="ts" setup>
  import LayoutHeaderSetting from '@/layout/components/LayoutHeaderSetting.vue';
  import LayoutMenu from '@/layout/components/LayoutMenu.vue';
  import defaultAvatar from '@/assets/images/common/default-avatar.png';
  import { SettingOutlined, MenuFoldOutlined, MenuUnfoldOutlined, FullscreenOutlined, FullscreenExitOutlined, ReloadOutlined } from '@/utils';
  import { LayoutHeaderProps, useLayoutHeader } from '@/layout/hooks/useLayoutHeader';
  import { APP_ENV_CONFIG } from '@/constant';

  defineProps(LayoutHeaderProps);

  const emit = defineEmits(['update:collapsed']);

  const title = APP_ENV_CONFIG.shortName;

  const {
    navMode,
    breadcrumbList,
    iconList,
    fullscreenBool,
    avatar,
    avatarOptions,
    headThemeOverrides,
    headerSettingRef,
    reloadPage,
    dropdownSelect,
    toggleFullscreen,
    avatarSelect,
    openSetting,
  } = useLayoutHeader();
</script>

<template>
  <n-config-provider :theme-overrides="headThemeOverrides">
    <div class="layout-header" :class="className">
      <!--顶部菜单-->
      <div v-if="navMode === 'horizontal' || navMode === 'horizontal-mix'" class="layout-header-left">
        <div v-if="navMode === 'horizontal'" class="logo">
          <img src="~@/assets/images/common/logo.png" alt="" />
          <h2 v-show="!collapsed" class="title">{{ title }}</h2>
        </div>
        <layout-menu mode="horizontal" :indent="100" :inverted="false" />
      </div>
      <!--左侧菜单-->
      <div v-else class="layout-header-left">
        <!-- 菜单收起 -->
        <div class="ml-5 layout-header-trigger layout-header-trigger-min" @click="() => emit('update:collapsed', !collapsed)">
          <n-icon v-if="collapsed" size="18">
            <MenuUnfoldOutlined />
          </n-icon>
          <n-icon v-else size="18">
            <MenuFoldOutlined />
          </n-icon>
        </div>
        <!-- 刷新 -->
        <div class="mr-5 layout-header-trigger layout-header-trigger-min" @click="reloadPage">
          <n-icon size="18">
            <ReloadOutlined />
          </n-icon>
        </div>
        <!-- 面包屑 -->
        <n-breadcrumb>
          <template v-for="breadItem in breadcrumbList" :key="breadItem.key">
            <n-breadcrumb-item>
              <n-dropdown v-if="breadItem.children && breadItem.children.length" :options="breadItem.children" @select="dropdownSelect">
                <span class="link-text">
                  <component :is="breadItem.icon" v-if="breadItem.icon" />
                  {{ breadItem.label }}
                </span>
              </n-dropdown>
              <span v-else class="link-text">
                <component :is="breadItem.icon" v-if="breadItem.icon" />
                {{ breadItem.label }}
              </span>
            </n-breadcrumb-item>
          </template>
        </n-breadcrumb>
      </div>
      <div class="layout-header-right">
        <div v-for="item in iconList" :key="item.tips" class="layout-header-trigger layout-header-trigger-min">
          <n-tooltip placement="bottom">
            <template #trigger>
              <n-icon size="18" :component="item.icon" v-on="item.eventObject || {}"></n-icon>
            </template>
            <span>{{ item.tips }}</span>
          </n-tooltip>
        </div>
        <!-- 切换全屏 -->
        <div class="layout-header-trigger layout-header-trigger-min">
          <n-tooltip placement="bottom">
            <template #trigger>
              <n-icon size="18" :component="fullscreenBool ? FullscreenExitOutlined : FullscreenOutlined" @click="toggleFullscreen"></n-icon>
            </template>
            <span>全屏</span>
          </n-tooltip>
        </div>
        <!-- 个人中心 -->
        <div class="layout-header-trigger layout-header-trigger-min">
          <n-dropdown trigger="hover" :options="avatarOptions" @select="avatarSelect">
            <div class="avatar">
              <n-avatar round :src="avatar" :fallback-src="defaultAvatar" />
            </div>
          </n-dropdown>
        </div>
        <!--设置-->
        <div class="layout-header-trigger layout-header-trigger-min" @click="openSetting">
          <n-tooltip placement="bottom-end">
            <template #trigger>
              <n-icon size="18">
                <SettingOutlined />
              </n-icon>
            </template>
            <span>项目配置</span>
          </n-tooltip>
        </div>
      </div>
    </div>
  </n-config-provider>
  <!--项目配置-->
  <LayoutHeaderSetting ref="headerSettingRef" />
</template>

<style lang="scss" scoped>
  .layout-header {
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: $header-height;
    padding: 0;
    color: $header-text-color;
    background-color: $header-back-color;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    transition: all 0.2s ease-in-out;

    &-left {
      display: flex;
      align-items: center;

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 10px;
        overflow: hidden;
        white-space: nowrap;

        img {
          width: auto;
          height: 32px;
          margin-right: 10px;
        }

        .title {
          margin-bottom: 0;
        }
      }

      .n-breadcrumb {
        display: inline-block;
      }

      &-menu {
        color: $font-color;
      }
    }

    &-right {
      display: flex;
      align-items: center;
      margin-right: 20px;

      .avatar {
        display: flex;
        align-items: center;
      }

      > * {
        cursor: pointer;
      }
    }

    &-trigger {
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      .n-icon {
        display: flex;
        align-items: center;
      }

      // &:hover {
      //   background: hsl(0deg 0% 100% / 8%);
      // }

      .anticon {
        color: #515a6e;
        font-size: 16px;
      }
    }

    &-trigger-min {
      width: auto;
      padding: 0 12px;
    }
  }

  .layout-header-light {
    color: #515a6e;
    background: #fff;

    .n-icon {
      color: #515a6e;
    }

    .layout-header-left {
      ::v-deep(.n-breadcrumb .n-breadcrumb-item:last-child .n-breadcrumb-item__link) {
        color: #515a6e;
      }
    }

    .layout-header-trigger {
      &:hover {
        background: #f8f8f9;
      }
    }
  }

  .layout-header-fix {
    position: fixed;
    top: 0;
    right: 0;
    left: 200px;
    z-index: 11;
  }
</style>
