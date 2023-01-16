<template>
  <n-drawer v-model:show="isDrawer" :width="width" :placement="placement">
    <n-drawer-content :header-style="{ width: '100%', display: 'block' }">
      <template #header>
        <div class="drawer-header">
          <div class="drawer-header__title">{{ title }}</div>
          <div class="drawer-header__btn">
            <n-button type="primary" size="small" @click="drawerSettingSubmit">保存</n-button>
          </div>
        </div>
      </template>
      <div class="drawer">
        <n-divider title-placement="center">主题</n-divider>

        <div class="drawer-setting-item justify-center dark-switch">
          <n-tooltip placement="bottom">
            <template #trigger>
              <n-switch v-model:value="isDarkTheme" class="dark-theme-switch">
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
          <div class="drawer-setting-item-style align-items-top">
            <n-tooltip placement="top">
              <template #trigger>
                <img src="~@/assets/images/setting/nav-theme-dark.svg" alt="左侧菜单模式" @click="togNavMode('vertical')" />
              </template>
              <span>左侧菜单模式</span>
            </n-tooltip>
            <n-badge v-show="navMode === 'vertical'" dot color="#19be6b" />
          </div>

          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img src="~@/assets/images/setting/nav-horizontal.svg" alt="顶部菜单模式" @click="togNavMode('horizontal')" />
              </template>
              <span>顶部菜单模式</span>
            </n-tooltip>
            <n-badge v-show="navMode === 'horizontal'" dot color="#19be6b" />
          </div>

          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img src="~@/assets/images/setting/nav-horizontal-mix.svg" alt="顶部菜单混合模式" @click="togNavMode('horizontal-mix')" />
              </template>
              <span>顶部菜单混合模式</span>
            </n-tooltip>
            <n-badge v-show="navMode === 'horizontal-mix'" dot color="#19be6b" />
          </div>
        </div>

        <n-divider title-placement="center">导航栏风格</n-divider>

        <div class="drawer-setting-item align-items-top">
          <div class="drawer-setting-item-style align-items-top">
            <n-tooltip placement="top">
              <template #trigger>
                <img src="~@/assets/images/setting/nav-theme-dark.svg" alt="暗色侧边栏" @click="togNavTheme('dark')" />
              </template>
              <span>暗色侧边栏</span>
            </n-tooltip>
            <n-badge v-if="navTheme === 'dark'" dot color="#19be6b" />
          </div>

          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img src="~@/assets/images/setting/nav-theme-light.svg" alt="白色侧边栏" @click="togNavTheme('light')" />
              </template>
              <span>白色侧边栏</span>
            </n-tooltip>
            <n-badge v-if="navTheme === 'light'" dot color="#19be6b" />
          </div>
        </div>

        <div class="drawer-setting-item align-items-top">
          <div class="drawer-setting-item-style">
            <n-tooltip placement="top">
              <template #trigger>
                <img src="~@/assets/images/setting/header-theme-dark.svg" alt="暗色顶栏" @click="togNavTheme('header-dark')" />
              </template>
              <span>暗色顶栏</span>
            </n-tooltip>
            <n-badge v-if="navTheme === 'header-dark'" dot color="#19be6b" />
          </div>
        </div>

        <n-divider title-placement="center">界面功能</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">分割菜单</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="menuSetting.mixMenu" :disabled="navMode !== 'horizontal-mix'" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">固定顶栏</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="headerSetting.fixed" />
          </div>
        </div>

        <!--        <div class="drawer-setting-item">-->
        <!--          <div class="drawer-setting-item-title">-->
        <!--            固定侧边栏-->
        <!--          </div>-->
        <!--          <div class="drawer-setting-item-action">-->
        <!--            <n-switch v-model:value="menuSetting.fixed" />-->
        <!--          </div>-->
        <!--        </div>-->

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">固定多页签</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="multiTabsSetting.fixed" />
          </div>
        </div>

        <n-divider title-placement="center">界面显示</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示重载页面按钮</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="headerSetting.isReload" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示面包屑导航</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="crumbsSetting.show" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示面包屑显示图标</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="crumbsSetting.showIcon" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示多页签</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="multiTabsSetting.show" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">显示页脚</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="showFooter" />
          </div>
        </div>

        <n-divider title-placement="center">动画</n-divider>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">禁用动画</div>
          <div class="drawer-setting-item-action">
            <n-switch v-model:value="isPageAnimate" />
          </div>
        </div>

        <div class="drawer-setting-item">
          <div class="drawer-setting-item-title">动画类型</div>
          <div class="drawer-setting-item-select">
            <n-select v-model:value="pageAnimateType" :options="animateSetting" />
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs, unref } from 'vue';
  import { CheckOutlined, Moon, SunnySharp } from '@/utils';
  import { animateSetting, appThemeList } from '@/constant';
  import { useSetting } from '@/hooks';
  import { CUserConfigInfo } from '/#/config';
  import { useUserStore } from '@/store';

  export default defineComponent({
    name: 'LayoutHeaderSetting',
    components: { CheckOutlined, Moon, SunnySharp },
    props: {
      title: {
        type: String,
        default: '项目配置',
      },
      width: {
        type: Number,
        default: 280,
      },
    },
    setup(props) {
      const state = reactive({
        width: props.width,
        title: props.title,
        isDrawer: false,
        placement: 'right',
        appThemeList,
      });

      const userStore = useUserStore();

      // 配置信息
      const {
        getIsDarkTheme,
        getNavTheme,
        getNavMode,
        getMenuSetting,
        getHeaderSetting,
        getMultiTabsSetting,
        getCrumbsSetting,
        getAppTheme,
        getIsPageAnimate,
        getPageAnimateType,
        getShowFooter,
      } = useSetting();
      const configInfo: CUserConfigInfo = reactive({
        navTheme: unref(getNavTheme),
        isDarkTheme: unref(getIsDarkTheme),
        menuSetting: unref(getMenuSetting),
        headerSetting: unref(getHeaderSetting),
        multiTabsSetting: unref(getMultiTabsSetting),
        crumbsSetting: unref(getCrumbsSetting),
        appTheme: unref(getAppTheme),
        navMode: unref(getNavMode),
        isPageAnimate: unref(getIsPageAnimate),
        pageAnimateType: unref(getPageAnimateType),
        showFooter: unref(getShowFooter),
      });

      // 展开
      const openDrawer = () => {
        state.isDrawer = true;
      };

      // 关闭
      const closeDrawer = () => {
        state.isDrawer = false;
      };

      // 设置导航风格
      const togNavTheme = (theme: string) => {
        let navTheme = theme;
        if (unref(getNavMode) === 'horizontal' && ['light'].includes(theme)) {
          navTheme = 'dark';
        }
        configInfo.navTheme = navTheme;
      };

      // 切换主题色
      const togTheme = (color: string) => {
        configInfo.appTheme = color;
      };

      // 切换导航模式
      const togNavMode = (mode: string) => {
        configInfo.navMode = mode;
        configInfo.menuSetting.mixMenu = false;
      };

      // 提交并保存
      const drawerSettingSubmit = () => {
        userStore.updateApiConfigInfo(JSON.parse(JSON.stringify(configInfo)));
      };

      return {
        ...toRefs(state),
        ...toRefs(configInfo),
        togNavTheme,
        togNavMode,
        togTheme,
        openDrawer,
        closeDrawer,
        animateSetting,
        drawerSettingSubmit,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .drawer {
    .n-divider:not(.n-divider--vertical) {
      margin: 10px 0;
    }

    &-setting-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      flex-wrap: wrap;

      &-style {
        display: inline-block;
        position: relative;
        margin-right: 16px;
        cursor: pointer;
        text-align: center;
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
        cursor: pointer;
        border: 1px solid #eee;
        border-radius: 2px;
        margin: 0 5px 5px 0;
        text-align: center;

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
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
