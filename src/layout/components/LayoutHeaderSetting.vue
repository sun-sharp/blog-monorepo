<script lang="ts" setup>
  import { CheckOutlined, Moon, SunnySharp } from '@/utils';
  import { ANIMATE_SETTING } from '@/constant';
  import { LayoutHeaderSettingProps, useLayoutHeaderSetting } from '@/layout/hooks/useLayoutHeaderSetting';

  const props = defineProps(LayoutHeaderSettingProps);

  const animateSetting = ANIMATE_SETTING;

  const {
    isDrawer,
    placement,
    isDarkTheme,
    submitLoading,
    navModeArr,
    navTheme,
    navThemeArr,
    appTheme,
    navMode,
    appThemeList,
    menuSetting,
    headerSetting,
    multiTabsSetting,
    crumbsSetting,
    isPageAnimate,
    pageAnimateType,
    footerSetting,
    togNavTheme,
    togNavMode,
    togTheme,
    switchChange,
    selectChange,
  } = useLayoutHeaderSetting(props);
</script>

<template>
  <n-drawer v-model:show="isDrawer" :width="width" :placement="placement">
    <n-drawer-content :title="title">
      <div class="drawer">
        <n-divider title-placement="center">主题</n-divider>

        <div class="drawer-setting-item justify-center dark-switch">
          <n-tooltip placement="bottom">
            <template #trigger>
              <n-switch v-model:value="isDarkTheme" :loading="submitLoading" class="dark-theme-switch" @update:value="switchChange">
                <template #checked>
                  <n-icon size="14" color="#ffd93b">
                    <SunnySharp />
                  </n-icon>
                </template>
                <template #unchecked>
                  <n-icon size="14" color="#ffd93b">
                    <Moon />
                  </n-icon>
                </template>
              </n-switch>
            </template>
            <span>{{ isDarkTheme ? '深' : '浅' }}色主题</span>
          </n-tooltip>
        </div>

        <n-divider title-placement="center">系统主题</n-divider>

        <div class="drawer-setting-item align-items-top">
          <span v-for="(item, index) in appThemeList" :key="index" class="theme-item" :style="{ 'background-color': item }" @click="togTheme(item)">
            <n-icon v-if="item === appTheme" size="12">
              <CheckOutlined />
            </n-icon>
          </span>
        </div>

        <n-divider title-placement="center">导航栏模式</n-divider>

        <div class="drawer-setting-item align-items-top">
          <div v-for="(item, index) in navModeArr" :key="index" class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img :src="item.image" :alt="item.title" @click="togNavMode(item.name)" />
              </template>
              <span>{{ item.title }}</span>
            </n-tooltip>
            <n-badge v-if="navMode === item.name" dot color="#19be6b" />
          </div>
        </div>

        <n-divider title-placement="center">导航栏风格</n-divider>

        <div class="drawer-setting-item align-items-top">
          <div v-for="(item, index) in navThemeArr" :key="index" class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img :src="item.image" :alt="item.title" @click="togNavTheme(item.name)" />
              </template>
              <span>{{ item.title }}</span>
            </n-tooltip>
            <n-badge v-if="navTheme === item.name" dot color="#19be6b" />
          </div>
        </div>

        <n-divider title-placement="center">界面功能</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">分割菜单</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="menuSetting.mixMenu" :loading="submitLoading" :disabled="navMode !== 'horizontal-mix'" @update:value="switchChange" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">固定顶栏</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="headerSetting.fixed" :loading="submitLoading" @update:value="switchChange" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">固定多页签</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="multiTabsSetting.fixed" :loading="submitLoading" @update:value="switchChange" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">固定底部</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="footerSetting.fixed" :loading="submitLoading" @update:value="switchChange" />
          </div>
        </div>

        <n-divider title-placement="center">界面显示</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示重载页面按钮</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="headerSetting.isReload" :loading="submitLoading" @update:value="switchChange" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示面包屑导航</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="crumbsSetting.show" :loading="submitLoading" @update:value="switchChange" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示面包屑显示图标</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="crumbsSetting.showIcon" :loading="submitLoading" @update:value="switchChange" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示多页签</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="multiTabsSetting.show" :loading="submitLoading" @update:value="switchChange" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示页脚</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="footerSetting.show" :loading="submitLoading" @update:value="switchChange" />
          </div>
        </div>

        <n-divider title-placement="center">动画</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">禁用动画</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="isPageAnimate" :loading="submitLoading" @update:value="switchChange" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">动画类型</div>
          <div class="drawer-setting-item-select">
            <n-select v-model:value="pageAnimateType" :loading="submitLoading" :options="animateSetting" @update:value="selectChange" />
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped>
  .drawer {
    .n-divider:not(.n-divider--vertical) {
      margin: 10px 0;
    }

    &-setting-item {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding: 12px 0;

      &-style {
        position: relative;
        display: inline-block;
        margin-right: 16px;
        text-align: center;
        cursor: pointer;
      }

      &-title {
        flex: 1 1;
        font-size: 14px;
      }

      &-action {
        flex: 0 0 auto;
      }

      &-select {
        flex: 1;
      }

      .theme-item {
        width: 20px;
        min-width: 20px;
        height: 20px;
        margin: 0 5px 5px 0;
        text-align: center;
        border: 1px solid #eee;
        border-radius: 2px;
        cursor: pointer;

        .n-icon {
          color: #fff;
        }
      }
    }

    .align-items-top {
      align-items: flex-start;
      padding: 2px 0;
    }

    .dark-switch .n-switch {
      ::v-deep(.n-switch__rail) {
        background-color: #000e1c;
      }
    }
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
</style>
