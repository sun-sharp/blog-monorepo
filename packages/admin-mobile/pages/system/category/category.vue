<template>
  <u-config-provider :dark-mode="mode">
    <view class="category-page" :class="{ dark: isDark }">
      <list-page
        ref="listPageRef"
        :api-fn="categoryApi.getPage"
        search-placeholder="搜索分类标签"
        search-key="label"
        :dropdown-items="dropdownItems"
        show-fab
        @fabClick="goToAdd"
        @itemLongpress="onLongPress">
        <template #default="{ list, longpress }">
          <view
            v-for="item in list"
            :key="item.categoryId"
            class="category-item card"
            :class="{ dark: isDark }"
            @click="goToEdit(item.categoryId)"
            @longpress="longpress(item)">
            <view class="category-item-left">
              <view class="category-item-icon" :style="{ background: getCategoryColor(item.type) }">
                <u-icon name="tags" size="32" color="#fff" />
              </view>
              <view class="category-item-info">
                <text class="category-item-label" :class="{ dark: isDark }">{{ item.label }}</text>
                <text class="category-item-type" :class="{ dark: isDark }">{{ getTypeLabel(item.type) }}</text>
              </view>
            </view>
            <view class="category-item-right">
              <text class="category-item-value" :class="{ dark: isDark }">{{ item.valueStr || item.value }}</text>
              <u-icon name="arrow-right" size="28" :color="isDark ? '#7d8085' : '#ccc'" />
            </view>
          </view>
        </template>
      </list-page>
    </view>
  </u-config-provider>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { consumeRefreshFlag } from '../../../composables/useRefreshFlag';
  import { useFilterBackPress } from '../../../composables/useFilterBackPress';
  import { categoryApi } from '../../../api';
  import { categoryTypeOption } from '../../../../shared/src/constants/api-type';
  import { useApiTypeStore } from '../../../store';
  import { useAppTheme } from '../../../composables/useAppTheme';
  import type { ApiCategoryItem } from '/#/api/capital/category';
  import ListPage from '../../../components/list-page/list-page.vue';

  const listPageRef = ref();
  const apiTypeStore = useApiTypeStore();
  const { isDark, mode } = useAppTheme();

  useFilterBackPress(listPageRef);

  const dropdownItems = [
    {
      title: '类型',
      key: 'type',
      options: [{ label: '全部类型', value: '' }, ...categoryTypeOption],
      value: '',
    },
  ];

  const categoryTypeMap: Record<string, string> = {};
  categoryTypeOption.forEach((item) => {
    categoryTypeMap[item.value] = item.label;
  });

  function getTypeLabel(type: string) {
    return categoryTypeMap[type] || type;
  }

  const categoryColorMap: Record<string, string> = {};
  const colorPool = [
    'linear-gradient(135deg, #4facfe, #007aff)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    'linear-gradient(135deg, #fccb90, #d57eeb)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
  ];

  function getCategoryColor(type: string) {
    if (!categoryColorMap[type]) {
      categoryColorMap[type] = colorPool[Object.keys(categoryColorMap).length % colorPool.length];
    }
    return categoryColorMap[type];
  }

  function goToAdd() {
    uni.navigateTo({ url: '/pages/system/category-edit/category-edit' });
  }

  function goToEdit(categoryId: string) {
    uni.navigateTo({ url: `/pages/system/category-edit/category-edit?id=${categoryId}` });
  }

  function onLongPress(item: ApiCategoryItem) {
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

  onShow(() => {
    if (consumeRefreshFlag('category')) listPageRef.value?.refresh();
  });
</script>

<style lang="scss" scoped>
  .category-page {
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
    transition: background-color 0.2s;

    &.dark {
      background-color: $dark-page-bg;
    }
  }

  .category-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    margin-bottom: 16rpx;

    &:active {
      opacity: 0.85;
    }
  }

  .category-item-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex: 1;
    min-width: 0;
  }

  .category-item-icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .category-item-info {
    flex: 1;
    min-width: 0;
  }

  .category-item-label {
    font-size: $uni-font-size-lg;
    font-weight: 500;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.dark {
      color: $dark-text-color;
    }
  }

  .category-item-type {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 6rpx;
    display: block;

    &.dark {
      color: $dark-text-color-3;
    }
  }

  .category-item-right {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-shrink: 0;
  }

  .category-item-value {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;

    &.dark {
      color: $dark-text-color-3;
    }
  }
</style>
