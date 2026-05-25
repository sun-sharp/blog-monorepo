<template>
  <view class="category-page">
    <view class="category-toolbar">
      <u-search
        v-model="keyword"
        placeholder="搜索分类标签"
        shape="round"
        :show-action="true"
        action-text="搜索"
        @search="handleSearch"
        @custom="handleSearch"
        @clear="handleClear" />
      <view class="category-toolbar-actions">
        <view class="category-filter-btn" :class="{ 'category-filter-btn--active': currentType !== '' }" @click="showTypeSelect = true">
          <u-icon name="setting" size="36" :color="currentType !== '' ? '#007aff' : '#666'" />
        </view>
      </view>
    </view>

    <view v-if="currentType !== ''" class="category-filter-tag">
      <u-icon name="tags" size="24" color="#007aff" />
      <text class="category-filter-tag-text">{{ currentTypeLabel }}</text>
      <u-icon name="close" size="24" color="#999" @click="clearTypeFilter" />
    </view>

    <scroll-view
      scroll-y
      class="category-list-scroll"
      :style="scrollStyle"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      refresher-default-style="black"
      @refresherrefresh="onPullDownRefresh"
      @scrolltolower="onReachBottom">
      <view v-if="loading && list.length === 0" class="category-loading">
        <u-loading mode="circle" size="60" />
        <text class="category-loading-text">加载中...</text>
      </view>
      <view v-if="!loading && list.length === 0" class="category-empty">
        <u-empty mode="data" text="暂无分类" icon-size="160" />
      </view>
      <view v-if="list.length > 0" class="category-list">
        <view v-for="item in list" :key="item.categoryId" class="category-item card" @click="goToEdit(item.categoryId)" @longpress="onLongPress(item)">
          <view class="category-item-left">
            <view class="category-item-icon" :style="{ background: getCategoryColor(item.type) }">
              <u-icon name="tags" size="32" color="#fff" />
            </view>
            <view class="category-item-info">
              <text class="category-item-label">{{ item.label }}</text>
              <text class="category-item-type">{{ getTypeLabel(item.type) }}</text>
            </view>
          </view>
          <view class="category-item-right">
            <text class="category-item-value">{{ item.valueStr || item.value }}</text>
            <u-icon name="arrow-right" size="28" color="#ccc" />
          </view>
        </view>
      </view>
      <u-loadmore :status="loadMoreStatus" @loadmore="loadMore" />
    </scroll-view>

    <u-fab icon="plus" position="right-bottom" :gap="{ right: 30, bottom: 30 }" @trigger="goToAdd" />

    <u-select v-model="showTypeSelect" :list="typeSelectOptions" title="选择类型" @confirm="onTypeConfirm" />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { categoryApi } from '../../../api';
  import { categoryTypeOption } from '../../../../shared/src/constants/api-type';
  import { useApiTypeStore } from '../../../store';
  import type { ApiCategoryItem } from '/#/api/capital/category';

  const apiTypeStore = useApiTypeStore();
  const keyword = ref('');
  const list = ref<ApiCategoryItem[]>([]);
  const loading = ref(false);
  const isRefreshing = ref(false);
  const current = ref(1);
  const total = ref(0);
  const pageSize = 10;
  const currentType = ref('');
  const showTypeSelect = ref(false);

  const scrollTopOffset = ref(0);
  const scrollStyle = computed(() => {
    const offset = scrollTopOffset.value;
    if (offset > 0) {
      return { height: `calc(100vh - ${offset}px)` };
    }
    return {};
  });

  const typeSelectOptions = [{ label: '全部类型', value: '' }, ...categoryTypeOption];

  const currentTypeLabel = computed(() => {
    if (!currentType.value) return '';
    const item = categoryTypeOption.find((o) => o.value === currentType.value);
    return item?.label || currentType.value;
  });

  const categoryTypeMap: Record<string, string> = {};
  categoryTypeOption.forEach((item) => {
    categoryTypeMap[item.value] = item.label;
  });

  function getTypeLabel(type: string) {
    return categoryTypeMap[type] || type;
  }

  const loadMoreStatus = computed(() => {
    if (loading.value) return 'loading';
    if (list.value.length >= total.value && total.value > 0) return 'nomore';
    return 'loadmore';
  });

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

  async function loadData(isRefresh = false) {
    if (loading.value) return;
    if (isRefresh) {
      current.value = 1;
      list.value = [];
    }
    loading.value = true;
    try {
      const params: any = { current: current.value, size: pageSize };
      if (keyword.value) params.label = keyword.value;
      if (currentType.value) params.type = currentType.value;
      const res = await categoryApi.getPage(params);
      if (isRefresh) {
        list.value = res.list || [];
      } else {
        list.value = [...list.value, ...(res.list || [])];
      }
      total.value = res.total || 0;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
      isRefreshing.value = false;
    }
  }

  function loadMore() {
    if (list.value.length < total.value) {
      current.value++;
      loadData();
    }
  }

  function onPullDownRefresh() {
    isRefreshing.value = true;
    loadData(true);
  }

  function onReachBottom() {
    if (!loading.value && list.value.length < total.value) {
      current.value++;
      loadData();
    }
  }

  function handleSearch() {
    loadData(true);
  }

  function handleClear() {
    keyword.value = '';
    loadData(true);
  }

  function onTypeConfirm(e: any) {
    const val = e[0]?.value ?? '';
    currentType.value = val;
    loadData(true);
  }

  function clearTypeFilter() {
    currentType.value = '';
    loadData(true);
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
          loadData(true);
        }
      },
    });
  }

  function calcScrollHeight() {
    try {
      const sysInfo = uni.getSystemInfoSync();
      const statusBarHeight = sysInfo.statusBarHeight || 0;
      const navBarHeight = 44;
      const toolbarHeight = 60;
      scrollTopOffset.value = statusBarHeight + navBarHeight + toolbarHeight;
    } catch {
      scrollTopOffset.value = 0;
    }
  }

  onMounted(() => {
    calcScrollHeight();
  });

  onShow(() => {
    loadData(true);
  });
</script>

<style lang="scss" scoped>
  .category-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .category-toolbar {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 16rpx 24rpx 0;
    background-color: $uni-bg-color;
  }

  .category-toolbar-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .category-filter-btn {
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16rpx;
    background-color: #f5f5f5;

    &--active {
      background-color: #e8f4fd;
    }
  }

  .category-filter-tag {
    display: inline-flex;
    align-items: center;
    gap: 8rpx;
    background-color: #e8f4fd;
    border-radius: 20rpx;
    padding: 8rpx 20rpx;
    margin: 12rpx 24rpx 0;
  }

  .category-filter-tag-text {
    font-size: 24rpx;
    color: #007aff;
  }

  .category-list-scroll {
    flex: 1;
    height: 0;
    margin-top: 12rpx;
  }

  .category-refresher {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 0;
    gap: 12rpx;
  }

  .category-refresher-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .category-list {
    padding: 0 20rpx;
  }

  .category-loading,
  .category-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;
  }

  .category-loading-text {
    margin-top: 20rpx;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-sm;
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
  }

  .category-item-type {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 6rpx;
    display: block;
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
  }
</style>
