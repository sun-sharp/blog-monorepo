<template>
  <view>
    <list-page ref="listPageRef" :api-fn="categoryApi.getPage" :show-search="false" :dropdown-items="dropdownItems" show-fab @fabClick="goToAdd">
      <template #default="{ list }">
        <u-cell-group>
          <u-swipe-action v-for="item in list" :key="item.categoryId" :options="swipeOptions" @click="onSwipeClick($event, item)">
            <u-cell-item :title="item.label" :label="item.type" @click="goToEdit(item.categoryId)">
              <template #value>
                <text class="category-value">{{ item.valueStr || item.value }}</text>
              </template>
            </u-cell-item>
          </u-swipe-action>
        </u-cell-group>
      </template>
    </list-page>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { categoryApi } from '../../../api';
  import { categoryTypeOption } from '../../../../shared/src/constants/api-type';
  import { useApiTypeStore } from '../../../store';
  import type { ApiCategoryItem } from '/#/api/capital/category';
  import ListPage from '../../../components/list-page/list-page.vue';

  const listPageRef = ref();
  const apiTypeStore = useApiTypeStore();

  const dropdownItems = [
    {
      title: '类型',
      key: 'type',
      options: [{ label: '全部类型', value: '' }, ...categoryTypeOption],
      value: '',
    },
  ];

  const swipeOptions = [
    { text: '编辑', style: { backgroundColor: '#007aff' } },
    { text: '删除', style: { backgroundColor: '#dd524d' } },
  ];

  function goToAdd() {
    uni.navigateTo({ url: '/pages/system/category-edit/category-edit' });
  }

  function goToEdit(categoryId: string) {
    uni.navigateTo({ url: `/pages/system/category-edit/category-edit?id=${categoryId}` });
  }

  function onSwipeClick(event: any, item: ApiCategoryItem) {
    const index = event.index;
    if (index === 0) {
      goToEdit(item.categoryId);
    } else if (index === 1) {
      uni.showModal({
        title: '确认删除',
        content: `确定删除分类「${item.label}」？`,
        success: async (res) => {
          if (res.confirm) {
            await categoryApi.remove(item.categoryId);
            apiTypeStore.againGetApiType(item.type);
            listPageRef.value?.refresh();
          }
        },
      });
    }
  }

  onShow(() => {
    listPageRef.value?.refresh();
  });
</script>

<style lang="scss" scoped>
  .category-value {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }
</style>
