<template>
  <view class="image-page">
    <view class="image-header card">
      <u-search v-model="searchKeyword" placeholder="搜索图片名称" shape="round" @search="handleSearch" @clear="handleClear" />
      <view class="image-filter-row">
        <u-subsection :list="sourceFilterOptions" :current="currentSourceFilter" mode="subsection" active-color="#007aff" @change="onSourceFilterChange" />
      </view>
    </view>

    <scroll-view
      scroll-y
      class="image-list-scroll"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      refresher-default-style="black"
      @refresherrefresh="onPullDownRefresh"
      @scrolltolower="onReachBottom">
      <view v-if="loading && list.length === 0" class="image-loading">
        <u-loading mode="circle" size="60" />
        <text class="image-loading-text">加载中...</text>
      </view>
      <view v-if="!loading && list.length === 0" class="image-empty">
        <u-empty mode="data" text="暂无图片" icon-size="160" />
      </view>
      <view v-if="list.length > 0" class="image-grid">
        <view v-for="item in list" :key="item.imageId" class="image-grid-item">
          <u-swipe-action :options="swipeOptions" @click="onSwipeClick($event, item)">
            <view class="image-card">
              <u-image :src="getImgUrl(item.url)" width="100%" height="200rpx" mode="aspectFill" :fade="true" @click="previewImage(getImgUrl(item.url))" />
              <view class="image-card-info">
                <text class="image-card-name text-ellipsis">{{ item.name }}</text>
                <text class="image-card-meta">{{ item.imageType }} · {{ item.uploadTime?.slice(0, 10) }}</text>
              </view>
            </view>
          </u-swipe-action>
        </view>
      </view>
      <u-loadmore :status="loadMoreStatus" @loadmore="loadMore" />
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import { imageApi } from '../../../api';
  import { useApiTypeStore } from '../../../store';
  import type { ApiImageItem } from '/#/api/capital/image';
  import { getImgUrl } from '../../../../shared/src/utils/files';

  const apiTypeStore = useApiTypeStore();
  const searchKeyword = ref('');
  const list = ref<ApiImageItem[]>([]);
  const loading = ref(false);
  const isRefreshing = ref(false);
  const current = ref(1);
  const total = ref(0);
  const pageSize = 20;
  const currentSourceFilter = ref(0);

  const imageSourceOption = computed(() => apiTypeStore.getImageSourceOption);

  const sourceFilterOptions = computed(() => {
    return ['全部', ...imageSourceOption.value.map((o) => o.label)];
  });

  const loadMoreStatus = computed(() => {
    if (loading.value) return 'loading';
    if (list.value.length >= total.value && total.value > 0) return 'nomore';
    return 'loadmore';
  });

  async function loadData(isRefresh = false) {
    if (loading.value) return;
    if (isRefresh) {
      current.value = 1;
      list.value = [];
    }
    loading.value = true;
    try {
      const params: any = { current: current.value, size: pageSize };
      if (searchKeyword.value) params.name = searchKeyword.value;
      const sourceIdx = currentSourceFilter.value;
      if (sourceIdx > 0 && imageSourceOption.value[sourceIdx - 1]) {
        params.source = imageSourceOption.value[sourceIdx - 1].value;
      }
      const res = await imageApi.getPage(params);
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
    searchKeyword.value = '';
    loadData(true);
  }

  function onSourceFilterChange(index: number) {
    currentSourceFilter.value = index;
    loadData(true);
  }

  function previewImage(url: string) {
    const urls = list.value.map((item) => item.url).filter(Boolean);
    uni.previewImage({ current: url, urls });
  }

  const swipeOptions = [{ text: '删除', style: { backgroundColor: '#dd524d' } }];

  function onSwipeClick(event: any, item: ApiImageItem) {
    if (event.index === 0) {
      uni.showModal({
        title: '确认删除',
        content: item.exists ? '将删除图片文件和数据' : '仅删除数据记录',
        success: async (res) => {
          if (res.confirm) {
            if (item.exists) {
              await imageApi.removePublicAndData(item.imageId);
            } else {
              await imageApi.removeData(item.imageId);
            }
            loadData(true);
          }
        },
      });
    }
  }

  onMounted(() => {
    apiTypeStore.getImageSource();
    loadData(true);
  });

  onShow(() => {
    loadData(true);
  });
</script>

<style lang="scss" scoped>
  .image-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: $uni-bg-color-grey;
  }

  .image-header {
    margin: 20rpx 20rpx 0;
  }

  .image-filter-row {
    margin-top: 16rpx;
  }

  .image-list-scroll {
    flex: 1;
    height: 0;
    margin-top: 12rpx;
  }

  .image-refresher {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 0;
    gap: 12rpx;
  }

  .image-refresher-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .image-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    padding: 0 20rpx;
  }

  .image-grid-item {
    width: calc(50% - 8rpx);
  }

  .image-card {
    background-color: $uni-bg-color;
    border-radius: $uni-border-radius-lg;
    overflow: hidden;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  }

  .image-card-info {
    padding: 12rpx 16rpx;
  }

  .image-card-name {
    font-size: $uni-font-size-sm;
    display: block;
  }

  .image-card-meta {
    font-size: 20rpx;
    color: $uni-text-color-grey;
    display: block;
    margin-top: 4rpx;
  }

  .image-loading,
  .image-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;
  }

  .image-loading-text {
    margin-top: 20rpx;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-sm;
  }
</style>
