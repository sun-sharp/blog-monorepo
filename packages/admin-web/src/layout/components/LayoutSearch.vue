<script lang="ts" setup>
  import { useRouteStore } from '@/store';
  import { SearchOutlined } from '@/utils';
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useSearch } from '@/hooks';
  import { APP_ENV_CONFIG, OUTSIDE_THE_CHAIN_VALUE, menuTagTypeNameObj, menuTypeObj } from '@/constant';
  import { ViewsMenu } from '/#/vue/views/menu';

  const router = useRouter();

  const title = APP_ENV_CONFIG.shortName;

  const searchValue = ref('');

  const routeStore = useRouteStore();
  const searchMenus = computed(() => routeStore.getSearchMenus);

  // 筛选菜单 在页面上循环
  const filterMenu = computed(() => {
    if (searchValue.value === '') {
      return searchMenus.value;
    }

    return searchMenus.value.filter((item) => {
      return (item.component && item.component.indexOf(searchValue.value) !== -1) || item.title.indexOf(searchValue.value) !== -1;
    });
  });

  // 点击跳转页面
  const toNestRouter = (item: ViewsMenu) => {
    if (item.menuType === OUTSIDE_THE_CHAIN_VALUE) {
      window.open(item.name);
    } else {
      router
        .push({
          name: item.name,
        })
        .then(() => {
          useSearch.value = false;
        });
    }
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
          <div class="flex ai-c">
            <component :is="item.icon" :key="item.menuId" class="main-item--icon" />
            <div class="main-item--cont">
              <div class="name">{{ item.title }}</div>
              <div class="path">{{ item.component || item.iframeSrc || item.name }}</div>
            </div>
          </div>
          <n-tag class="mr-30" :type="menuTagTypeNameObj[item.menuType]">{{ menuTypeObj[item.menuType] }}</n-tag>
        </div>
      </n-scrollbar>
      <n-empty v-else class="w-full h-full justify-center" description="抱歉，没有找到相关页面！！"></n-empty>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
  .layout-search {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding: 20px;
    background: $background-color;

    &__wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 40%;
      height: 150px;
      margin: 0 auto;

      .logo {
        width: auto;
        height: 32px;
        margin-bottom: 5px;
        text-align: center;
      }

      .title {
        margin-bottom: 10px;
        text-align: center;
      }

      .tip {
        margin-top: 15px;
        color: #999;
        font-size: 12px;

        span {
          display: inline-block;
          height: 18px;
          margin: 0 3px;
          padding: 0 5px;
          color: #fff;
          line-height: 18px;
          background: $theme-color;
          border-radius: 2px;
        }
      }
    }

    &__main {
      flex: 1;
      height: 0;

      .main-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        color: #444;
        border-left: 4px solid transparent;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          color: $theme-color;
          background: $background-color;
          border-color: $theme-color;
        }

        &--icon {
          font-size: 22px;
        }

        &--cont {
          padding-left: 10px;

          .name {
            margin-bottom: 5px;
            font-weight: bold;
            font-size: 14px;
          }

          .path {
            width: 100%;
            color: #999;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
