<script lang="ts" setup>
  import { CheckOutlined, Moon, SunnySharp } from '@/utils';
  import { appThemeList, navModeArr, topBarStyleArr } from '@/constant';
  import { LayoutHeaderSettingProps, useLayoutHeaderSetting } from '@/layout/hooks/useLayoutHeaderSetting';
  import { CSSProperties } from 'vue';

  const props = defineProps(LayoutHeaderSettingProps);

  const {
    isDrawer,
    placement,
    isDarkTheme,
    appTheme,
    navMode,
    siderIsDark,
    topBarStyle,
    // navTheme,
    // navThemeArr,
    // menuSetting,
    // headerSetting,
    // multiTabsSetting,
    // crumbsSetting,
    // isPageAnimate,
    // pageAnimateType,
    // footerSetting,
    // togNavTheme,
    submitLoading,
    switchChange,
    togTheme,
    togNavMode,
    radioChange,
    // selectChange,
    openDrawer,
  } = useLayoutHeaderSetting(props);

  // 主题按钮样式
  const themeRailStyle = () => {
    const style: CSSProperties = { background: '#000e1c' };
    return style;
  };

  defineExpose({ openDrawer });
</script>

<template>
  <n-drawer v-model:show="isDrawer" :width="width" :placement="placement">
    <n-drawer-content :title="title">
      <div class="drawer">
        <n-divider title-placement="center">系统主题</n-divider>
        <div class="drawer-setting-item justify-center pv-12">
          <n-tooltip placement="bottom">
            <template #trigger>
              <n-switch v-model:value="isDarkTheme" :loading="submitLoading" :rail-style="themeRailStyle" @update:value="switchChange">
                <template #checked>
                  <n-icon size="14" color="#ffce00">
                    <SunnySharp />
                  </n-icon>
                </template>
                <template #unchecked>
                  <n-icon size="14" color="#ffce00">
                    <Moon />
                  </n-icon>
                </template>
              </n-switch>
            </template>
            <span>{{ isDarkTheme ? '深' : '浅' }}色主题</span>
          </n-tooltip>
        </div>

        <n-divider title-placement="center">系统主题色</n-divider>
        <div class="drawer-setting-item justify-between pv-2">
          <span v-for="(item, index) in appThemeList" :key="index" class="theme-item" :style="{ 'background-color': item }" @click="togTheme(item)">
            <n-icon v-if="item === appTheme" size="12">
              <CheckOutlined />
            </n-icon>
          </span>
        </div>

        <n-divider title-placement="center">导航栏模式</n-divider>
        <div class="drawer-setting-item justify-between pv-2">
          <div v-for="(item, index) in navModeArr" :key="index" class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img class="drawer-setting-item-image" :src="item.image" :alt="item.title" @click="togNavMode(item.name)" />
              </template>
              <span>{{ item.title }}</span>
            </n-tooltip>
            <n-badge class="drawer-setting-item-dot" dot :color="navMode === item.name ? '#19be6b' : '#fff'" />
          </div>
        </div>

        <n-divider title-placement="center">导航栏风格</n-divider>
        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">侧边栏主题</div>
          <div class="drawer-setting-item-action">
            <n-tooltip placement="bottom">
              <template #trigger>
                <n-switch v-model:value="siderIsDark" :loading="submitLoading" @update:value="switchChange">
                  <template #checked>
                    <n-icon size="14" color="#ffce00">
                      <SunnySharp />
                    </n-icon>
                  </template>
                  <template #unchecked>
                    <n-icon size="14" color="#ffce00">
                      <Moon />
                    </n-icon>
                  </template>
                </n-switch>
              </template>
              <span>{{ siderIsDark ? '深' : '浅' }}色主题</span>
            </n-tooltip>
          </div>
        </div>
        <!-- <div class="drawer-setting-item-title">侧边栏样式</div>
        <div class="pv-10 pl-20"></div> -->

        <div class="drawer-setting-item-title">顶栏栏样式</div>
        <div class="pv-10 pl-20">
          <n-radio-group v-model:value="topBarStyle" name="radiogroup" @update:value="radioChange">
            <n-space>
              <n-radio v-for="(item, index) in topBarStyleArr" :key="index" :value="item.name">{{ item.title }}</n-radio>
            </n-space>
          </n-radio-group>
        </div>
        <!-- <div class="drawer-setting-item align-items-top">
          <div v-for="(item, index) in navThemeArr" :key="index" class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img :src="item.image" :alt="item.title" @click="togNavTheme(item.name)" />
              </template>
              <span>{{ item.title }}</span>
            </n-tooltip>
            <n-badge v-if="navTheme === item.name" dot color="#19be6b" />
          </div>
        </div> -->

        <!--<n-divider title-placement="center">界面功能</n-divider>

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
        </div> -->
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

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
</style>
