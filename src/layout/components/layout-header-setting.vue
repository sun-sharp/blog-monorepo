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

<script lang="ts">
  import { defineComponent, reactive, toRefs, unref, ref, ComputedRef } from 'vue';
  import { CheckOutlined, Moon, SunnySharp } from '@/utils';
  import { animateSetting, appThemeList } from '@/constant';
  import { useSetting } from '@/hooks';
  import { CUserConfigInfo } from '/#/config';
  import { useUserStore } from '@/store';
  import navThemeDarkImage from '@/assets/images/setting/nav-theme-dark.svg';
  import navHorizontalImage from '@/assets/images/setting/nav-horizontal.svg';
  import navHorizontalMixImage from '@/assets/images/setting/nav-horizontal-mix.svg';
  import navThemeLightImage from '@/assets/images/setting/nav-theme-light.svg';
  import headerThemeDarkImage from '@/assets/images/setting/header-theme-dark.svg';

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
        getFooterSetting,
      } = useSetting();

      // 复制computed的内容
      const copyComputedObj = (obj: ComputedRef) => {
        return Object.assign({}, unref(obj));
      };
      const configInfo: CUserConfigInfo = reactive({
        navTheme: unref(getNavTheme),
        isDarkTheme: unref(getIsDarkTheme),
        menuSetting: copyComputedObj(getMenuSetting),
        headerSetting: copyComputedObj(getHeaderSetting),
        multiTabsSetting: copyComputedObj(getMultiTabsSetting),
        crumbsSetting: copyComputedObj(getCrumbsSetting),
        appTheme: unref(getAppTheme),
        navMode: unref(getNavMode),
        isPageAnimate: unref(getIsPageAnimate),
        pageAnimateType: unref(getPageAnimateType),
        footerSetting: unref(getFooterSetting),
      });

      // 展开
      const openDrawer = () => {
        state.isDrawer = true;
      };

      // 关闭
      const closeDrawer = () => {
        state.isDrawer = false;
      };

      // 提交并保存
      const submitLoading = ref(false);
      const drawerSettingSubmit = () => {
        submitLoading.value = true;
        userStore.updateApiConfigInfo(Object.assign({}, configInfo)).finally(() => {
          submitLoading.value = false;
        });
      };

      // 切换导航模式
      const navModeArr = [
        {
          title: '左侧菜单模式',
          name: 'vertical',
          image: navThemeDarkImage,
        },
        {
          title: '顶部菜单模式',
          name: 'horizontal',
          image: navHorizontalImage,
        },
        {
          title: '顶部菜单混合模式',
          name: 'horizontal-mix',
          image: navHorizontalMixImage,
        },
      ];
      const togNavMode = (mode: string) => {
        configInfo.navMode = mode;
        configInfo.menuSetting.mixMenu = false;
        drawerSettingSubmit();
      };

      // 设置导航风格
      const navThemeArr = [
        {
          title: '暗色侧边栏',
          name: 'dark',
          image: navThemeDarkImage,
        },
        {
          title: '白色侧边栏',
          name: 'light',
          image: navThemeLightImage,
        },
        {
          title: '暗色顶栏',
          name: 'header-dark',
          image: headerThemeDarkImage,
        },
      ];
      const togNavTheme = (theme: string) => {
        let navTheme = theme;
        if (configInfo.navMode === 'horizontal' && ['light'].includes(theme)) {
          navTheme = 'dark';
        }
        if (configInfo.navTheme === navTheme) return;
        configInfo.navTheme = navTheme;
        drawerSettingSubmit();
      };

      // 切换主题色
      const togTheme = (color: string) => {
        configInfo.appTheme = color;
        drawerSettingSubmit();
      };

      // 开关组件变化
      const switchChange = () => drawerSettingSubmit();

      // 选择器
      const selectChange = () => drawerSettingSubmit();

      return {
        ...toRefs(state),
        ...toRefs(configInfo),
        animateSetting,
        submitLoading,
        navModeArr,
        navThemeArr,
        togNavTheme,
        togNavMode,
        togTheme,
        openDrawer,
        closeDrawer,
        drawerSettingSubmit,
        switchChange,
        selectChange,
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
