<script lang="ts" setup>
  import { useSetting } from '@/hooks';
  import { useRouteStore } from '@/store';
  import { getAppEnvConfig, SearchOutlined } from '@/utils';
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useSearch } from '@/hooks';

  const router = useRouter();

  const appEnvConfig = getAppEnvConfig();
  const title = appEnvConfig.shortName;

  const { getAppTheme } = useSetting();

  const searchValue = ref('');

  const routeStore = useRouteStore();
  const searchMenus = computed(() => routeStore.getSearchMenus);

  // 筛选菜单 在页面上循环
  const filterMenu = computed(() => {
    if (searchValue.value === '') {
      return searchMenus.value;
    }

    return searchMenus.value.filter((item) => {
      return item.component.indexOf(searchValue.value) !== -1 || item.title.indexOf(searchValue.value) !== -1;
    });
  });

  // 点击跳转页面
  const toNestRouter = (item: { name: any }) => {
    router
      .push({
        name: item.name,
      })
      .then(() => {
        useSearch.value = false;
      });
  };
</script>

<template>
  <div class="layout-search">
    <div class="layout-search__wrap">
      <img class="logo" src="~@/assets/images/common/logo.png" alt="" />
      <h2 class="title">{{ title }}</h2>
      <n-input v-model:value="searchValue" placeholder="搜索页面（路径或者名称）">
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
    <n-card :bordered="false" class="layout-search__main" content-style="height: 0;padding: 5px">
      <n-scrollbar v-if="filterMenu.length > 0" trigger="none">
        <div v-for="(item, index) in filterMenu" :key="index" class="main-item" @click="toNestRouter(item)">
          <component :is="item.icon" :key="item.menuId" class="main-item--icon" />
          <div class="main-item--cont">
            <div class="name">{{ item.title }}</div>
            <div class="path">{{ item.component }}</div>
          </div>
        </div>
      </n-scrollbar>
      <n-empty v-else class="w-full h-full justify-center" description="抱歉，没有找到相关页面！！"></n-empty>
    </n-card>
  </div>
</template>

<style lang="scss">
  $backColor: #f5f7fa;
  $themeColor: v-bind(getAppTheme);
  .layout-search {
    width: 100%;
    height: 100%;
    background: $backColor;
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
          background: $themeColor;
          border-radius: 2px;
          color: #fff;
          margin: 0 3px;
        }
      }
    }

    &__main {
      height: calc(100% - 170px);

      .main-item {
        display: flex;
        align-items: center;
        color: #444;
        transition: all 0.2s;
        border-left: 4px solid transparent;
        padding: 10px;
        cursor: pointer;

        &:hover {
          background: $backColor;
          color: $themeColor;
          border-color: $themeColor;
        }

        &--icon {
          font-size: 22px;
        }

        &--cont {
          padding-left: 10px;

          .name {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .path {
            width: 100%;
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
</style>
