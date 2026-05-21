<template>
  <view>
    <view class="menu-search">
      <u-search v-model="keyword" placeholder="搜索菜单" @search="handleSearch" @clear="handleSearch" />
    </view>
    <view v-if="loading" class="menu-loading">
      <u-loading mode="circle" />
    </view>
    <view v-else-if="filterList.length === 0" class="menu-empty">
      <u-empty mode="data" text="暂无菜单" />
    </view>
    <view v-else class="menu-list">
      <u-collapse>
        <u-collapse-item v-for="item in filterList" :key="item.menuId" :title="item.title" :name="item.menuId">
          <template #value>
            <view class="menu-item-meta">
              <u-tag :text="menuTypeObj[item.menuType] || '未知'" :type="menuTagType[item.menuType] || 'info'" size="mini" plain />
            </view>
          </template>
          <u-cell-group>
            <u-cell-item v-for="child in item.children" :key="child.menuId" :title="child.title" @click="goToEdit(child.menuId)">
              <template #value>
                <u-tag :text="menuTypeObj[child.menuType] || '未知'" :type="menuTagType[child.menuType] || 'info'" size="mini" plain />
              </template>
            </u-cell-item>
          </u-cell-group>
        </u-collapse-item>
      </u-collapse>
    </view>
    <u-fab icon="plus" @click="goToAdd" />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { menuApi } from '../../../api';
  import { menuTypeOption } from '../../../../shared/src/constants/api-type';
  import type { ApiLevelMenuItem } from '/#/api/capital/menu';

  const loading = ref(false);
  const menuList = ref<ApiLevelMenuItem[]>([]);
  const keyword = ref('');

  const menuTypeObj: Record<number, string> = {};
  const menuTagType: Record<number, string> = {};
  menuTypeOption.forEach((item) => {
    menuTypeObj[item.value] = item.label;
    menuTagType[item.value] = item.tagTypeName;
  });

  const filterList = computed(() => {
    if (!keyword.value) return menuList.value;
    const kw = keyword.value.toLowerCase();
    return menuList.value.filter((item) => item.title?.toLowerCase().includes(kw) || item.children?.some((c) => c.title?.toLowerCase().includes(kw)));
  });

  async function loadMenuList() {
    loading.value = true;
    try {
      const res = await menuApi.getMenuList();
      const map = new Map<string, ApiLevelMenuItem>();
      const roots: ApiLevelMenuItem[] = [];
      res.forEach((item) => {
        const levelItem: ApiLevelMenuItem = { ...item, children: [] };
        map.set(item.menuId, levelItem);
      });
      map.forEach((item) => {
        if (item.parentId && map.has(item.parentId)) {
          map.get(item.parentId)!.children!.push(item);
        } else {
          roots.push(item);
        }
      });
      menuList.value = roots;
    } catch {
      menuList.value = [];
    } finally {
      loading.value = false;
    }
  }

  function handleSearch() {}

  function goToAdd() {
    uni.navigateTo({ url: '/pages/system/menu-edit/menu-edit' });
  }

  function goToEdit(menuId: string) {
    uni.navigateTo({ url: `/pages/system/menu-edit/menu-edit?id=${menuId}` });
  }

  onMounted(() => {
    loadMenuList();
  });

  onShow(() => {
    loadMenuList();
  });
</script>

<style lang="scss" scoped>
  .menu-search {
    padding: 20rpx;
  }

  .menu-loading,
  .menu-empty {
    display: flex;
    justify-content: center;
    padding-top: 200rpx;
  }

  .menu-list {
    padding: 0 20rpx;
  }

  .menu-item-meta {
    display: flex;
    gap: 10rpx;
  }
</style>
