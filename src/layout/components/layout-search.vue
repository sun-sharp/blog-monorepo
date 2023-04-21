<script lang="ts" setup>
  import { useSetting } from '@/hooks';
  import { getAppEnvConfig, SearchOutlined } from '@/utils';

  const appEnvConfig = getAppEnvConfig();
  const title = appEnvConfig.shortName;

  const { getAppTheme } = useSetting();

  const get_app_theme = getAppTheme;

  // 筛选菜单 在页面上循环
  // const funMenu = () => {
  //   if (searchValue.value === '') {
  //     return menus;
  //   }

  //   return menus.filter((item: Arr) => {
  //     return item.path.indexOf(searchValue.value) != -1 || (item.meta && item.meta.locale && t(item.meta.locale as string).indexOf(searchValue.value) != -1);
  //   });
  // };
</script>

<template>
  <div class="layout-search">
    <div class="layout-search__wrap">
      <img class="logo" src="~@/assets/images/common/logo.png" alt="" />
      <h2 class="title">{{ title }}</h2>
      <n-input placeholder="搜索页面（路径或者名称）">
        <template #suffix>
          <n-icon :component="SearchOutlined" />
        </template>
      </n-input>
      <div class="tip">
        您可以使用快捷键
        <span>alt + q</span>
        唤起搜索面板，按
        <span>esc</span>
        关闭
      </div>
    </div>
    <n-card :bordered="false">
      <n-scrollbar trigger="none">asdsa</n-scrollbar>
    </n-card>
  </div>
</template>

<style lang="scss">
  .layout-search {
    width: 100%;
    background: #eff1f4;
    box-sizing: border-box;
    padding: 20px;

    &__wrap {
      margin: 0 auto;
      height: 150px;
      width: 40%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .logo {
        width: auto;
        height: 32px;
        text-align: center;
        margin-bottom: 5px;
      }

      .title {
        text-align: center;
        margin-bottom: 10px;
      }

      .tip {
        margin-top: 15px;
        font-size: 12px;
        color: #999;
        span {
          display: inline-block;
          padding: 0px 5px;
          height: 18px;
          line-height: 18px;
          background: v-bind(get_app_theme);
          border-radius: 2px;
          color: #fff;
          margin: 0 3px;
        }
      }
    }
  }
</style>
