<script lang="ts" setup>
  import { CheckOutlined, Moon, SunnySharp } from '@/utils';
  import { appThemeList, appThemeColorList, navModeArr, animateList } from '@/constant';
  import { LayoutHeaderSettingProps, useLayoutHeaderSetting } from '@/layout/hooks/useLayoutHeaderSetting';
  // import { CSSProperties } from 'vue';

  const props = defineProps(LayoutHeaderSettingProps);

  const {
    appTheme,
    appThemeColor,
    isDrawer,
    placement,
    navMode,
    siderIsDark,
    headIsDark,
    headFixed,
    tabsViewFixed,
    footerFixed,
    headerReloadShow,
    headerBreadcrumbShow,
    headerBreadcrumbShowIcon,
    tabsViewShow,
    footerShow,
    hasPageAnimate,
    pageAnimateType,
    submitLoading,
    togTheme,
    togThemeColor,
    tabsViewShowChange,
    footerShowChange,
    radioChange,
    switchChange,
    selectChange,
    openDrawer,
    drawerReset,
    drawerSettingSubmit,
  } = useLayoutHeaderSetting(props);

  // 主题按钮样式
  // const themeRailStyle = () => {
  //   const style: CSSProperties = { background: '#000e1c' };
  //   return style;
  // };

  defineExpose({ openDrawer });
</script>

<template>
  <n-drawer v-model:show="isDrawer" class="layout-header-setting" :width="width" :placement="placement">
    <n-drawer-content :title="title" header-style="padding: 10px 16px" footer-style="padding: 10px 16px" body-content-style="padding: 16px">
      <div class="layout-header-setting__drawer">
        <n-divider class="mv-10" title-placement="center">系统主题</n-divider>
        <div class="drawer-setting-item justify-center pv-12">
          <n-radio-group v-model:value="appTheme" name="radiogroup" @update:value="togTheme">
            <n-space>
              <n-radio v-for="(item, index) in appThemeList" :key="index" :value="item.value">{{ item.label }}</n-radio>
            </n-space>
          </n-radio-group>
        </div>

        <n-divider class="mv-10" title-placement="center">系统主题色</n-divider>
        <div class="drawer-setting-item justify-between pv-2">
          <span v-for="(item, index) in appThemeColorList" :key="index" class="theme-item" :style="{ 'background-color': item }" @click="togThemeColor(item)">
            <n-icon v-if="item === appThemeColor" size="12">
              <CheckOutlined />
            </n-icon>
          </span>
        </div>

        <n-divider class="mv-10" title-placement="center">菜单模式</n-divider>
        <div class="drawer-setting-item justify-center pv-2">
          <n-radio-group v-model:value="navMode" name="radiogroup" @update:value="radioChange">
            <n-space>
              <n-radio v-for="(item, index) in navModeArr" :key="index" :value="item.name">{{ item.title }}</n-radio>
            </n-space>
          </n-radio-group>
        </div>

        <n-divider class="mv-10" title-placement="center">导航栏风格</n-divider>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">侧边栏主题</div>
          <div class="drawer-setting-item-action">
            <n-tooltip placement="bottom">
              <template #trigger>
                <n-switch v-model:value="siderIsDark" :disabled="appTheme === 'dark'" @update:value="switchChange">
                  <template #checked>
                    <n-icon size="14" color="#fff">
                      <SunnySharp />
                    </n-icon>
                  </template>
                  <template #unchecked>
                    <n-icon size="14" :color="appThemeColor">
                      <Moon />
                    </n-icon>
                  </template>
                </n-switch>
              </template>
              <span>{{ siderIsDark ? '深' : '浅' }}色主题</span>
            </n-tooltip>
          </div>
        </div>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">顶栏主题</div>
          <div class="drawer-setting-item-action">
            <n-tooltip placement="bottom">
              <template #trigger>
                <n-switch v-model:value="headIsDark" :disabled="appTheme === 'dark'" @update:value="switchChange">
                  <template #checked>
                    <n-icon size="14" color="#fff">
                      <SunnySharp />
                    </n-icon>
                  </template>
                  <template #unchecked>
                    <n-icon size="14" :color="appThemeColor">
                      <Moon />
                    </n-icon>
                  </template>
                </n-switch>
              </template>
              <span>{{ headIsDark ? '深' : '浅' }}色主题</span>
            </n-tooltip>
          </div>
        </div>

        <n-divider class="mv-10" title-placement="center">界面显示</n-divider>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示重载页面按钮</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="headerReloadShow" @update:value="switchChange" />
          </div>
        </div>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示面包屑导航</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="headerBreadcrumbShow" @update:value="switchChange" />
          </div>
        </div>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示面包屑显示图标</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="headerBreadcrumbShowIcon" @update:value="switchChange" />
          </div>
        </div>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示标签页</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="tabsViewShow" @update:value="tabsViewShowChange" />
          </div>
        </div>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示页脚</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="footerShow" @update:value="footerShowChange" />
          </div>
        </div>

        <n-divider class="mv-10" title-placement="center">界面功能</n-divider>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">固定顶栏</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="headFixed" @update:value="switchChange" />
          </div>
        </div>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">固定标签页</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="tabsViewFixed" :disabled="!tabsViewShow" @update:value="switchChange" />
          </div>
        </div>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">固定页脚</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="footerFixed" :disabled="!footerShow" @update:value="switchChange" />
          </div>
        </div>

        <n-divider class="mv-10" title-placement="center">动画</n-divider>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">页面跳转动画</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="hasPageAnimate" @update:value="switchChange" />
          </div>
        </div>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">页面跳转动画类型</div>
          <div class="drawer-setting-item-select">
            <n-select v-model:value="pageAnimateType" :options="animateList" @update:value="selectChange" />
          </div>
        </div>
      </div>
      <template #footer>
        <n-button class="mr-15" @click="drawerReset">重置</n-button>
        <n-button type="primary" :loading="submitLoading" @click="drawerSettingSubmit">保存</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped>
  .layout-header-setting {
    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    &__drawer {
      .drawer-setting-item {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding: 5px 0;

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

        &-image {
          width: 52px;
          height: 45px;
        }

        &-dot {
          display: flex;
          justify-content: center;
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
    }
  }
</style>
