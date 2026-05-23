<template>
  <view class="article-page">
    <view class="article-toolbar">
      <u-search
        v-model="keyword"
        placeholder="搜索文章标题"
        shape="round"
        :show-action="true"
        action-text="搜索"
        @search="handleSearch"
        @custom="handleSearch"
        @clear="handleClear" />
      <view class="article-toolbar-actions">
        <view class="article-toolbar-btn" @click="showFilter = !showFilter">
          <u-icon name="setting" size="36" :color="showFilter || hasFilter ? '#007aff' : '#666'" />
        </view>
      </view>
    </view>

    <view v-if="showFilter" class="article-filter">
      <view class="article-filter-row">
        <text class="article-filter-label">分类</text>
        <view class="article-filter-picker" @click="showCategoryPicker = true">
          <text :class="currentCategoryLabel ? 'article-filter-value' : 'article-filter-placeholder'">
            {{ currentCategoryLabel || '全部分类' }}
          </text>
          <u-icon name="arrow-down" size="24" color="#999" />
        </view>
      </view>
      <view class="article-filter-row">
        <text class="article-filter-label">状态</text>
        <u-subsection
          :list="statusOptions"
          :current="currentStatus"
          mode="button"
          active-color="#007aff"
          inactive-color="#666666"
          bg-color="#f5f5f5"
          size="mini"
          @change="onStatusChange" />
      </view>
    </view>

    <scroll-view
      scroll-y
      class="article-list-scroll"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      refresher-default-style="none"
      @refresherrefresh="onPullDownRefresh"
      @scrolltolower="onReachBottom">
      <template #refresher>
        <view class="article-refresher">
          <u-loading v-if="isRefreshing" mode="circle" size="40" />
          <text class="article-refresher-text">{{ isRefreshing ? '刷新中...' : '下拉刷新' }}</text>
        </view>
      </template>
      <view v-if="loading && list.length === 0" class="article-loading">
        <u-loading mode="circle" size="60" />
        <text class="article-loading-text">加载中...</text>
      </view>
      <view v-else-if="!loading && list.length === 0" class="article-empty">
        <u-empty mode="data" text="暂无文章" icon-size="160" />
      </view>
      <view v-else class="article-list">
        <u-swipe-action v-for="item in list" :key="item.articleId" :options="swipeOptions" @click="onSwipeClick($event, item)">
          <view class="article-item card" @click="goToEdit(item.articleId)">
            <view class="article-item-main">
              <view class="article-item-icon" :class="item.isPrivate ? 'article-item-icon-private' : 'article-item-icon-public'">
                <u-icon :name="item.isPrivate ? 'lock' : 'file-text'" size="32" color="#fff" />
              </view>
              <view class="article-item-content">
                <view class="article-item-header">
                  <text class="article-item-title">{{ item.title }}</text>
                  <u-tag v-if="item.isPrivate" text="加密" type="warning" size="mini" plain />
                </view>
                <text v-if="item.brief" class="article-item-brief">{{ item.brief }}</text>
                <view class="article-item-footer">
                  <view class="article-item-meta">
                    <u-icon name="calendar" size="22" color="#999" />
                    <text class="article-item-time">{{ item.createTime?.slice(0, 10) }}</text>
                  </view>
                  <view class="article-item-meta">
                    <u-icon name="account" size="22" color="#999" />
                    <text class="article-item-author">{{ item.authorNickname || '未知作者' }}</text>
                  </view>
                </view>
              </view>
            </view>
            <view v-if="item.categoryVal" class="article-item-tags">
              <u-tag :text="getCategoryLabel(item.categoryVal)" type="primary" size="mini" plain />
            </view>
          </view>
        </u-swipe-action>
        <u-loadmore :status="loadMoreStatus" @loadmore="loadMore" />
      </view>
    </scroll-view>

    <u-fab icon="plus" position="right-bottom" :gap="{ right: 60, bottom: 150 }" @click="goToAdd" />

    <u-picker
      v-model="showCategoryPicker"
      mode="selector"
      :range="categoryPickerOptions"
      range-key="label"
      :default-selector="[categoryPickerIndex]"
      @confirm="onCategoryConfirm" />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { articleAPi } from '../../api';
  import { useApiTypeStore } from '../../store';
  import type { ApiArticleItem } from '/#/api/blog/article';

  const props = defineProps<{ active: boolean }>();

  const apiTypeStore = useApiTypeStore();

  const keyword = ref('');
  const list = ref<ApiArticleItem[]>([]);
  const loading = ref(false);
  const isRefreshing = ref(false);
  const current = ref(1);
  const total = ref(0);
  const showFilter = ref(false);
  const showCategoryPicker = ref(false);
  const currentCategory = ref<number | string>('');
  const currentStatus = ref(0);
  const inited = ref(false);

  const pageSize = 10;

  const articleCategoryOption = computed(() => apiTypeStore.getArticleCategoryOption);

  const categoryPickerOptions = computed(() => [{ label: '全部分类', value: '' }, ...articleCategoryOption.value]);

  const categoryPickerIndex = computed(() => {
    const idx = categoryPickerOptions.value.findIndex((item) => item.value === currentCategory.value);
    return idx >= 0 ? idx : 0;
  });

  const currentCategoryLabel = computed(() => {
    if (!currentCategory.value) return '';
    const item = articleCategoryOption.value.find((opt) => opt.value === currentCategory.value);
    return item?.label || '';
  });

  const hasFilter = computed(() => currentCategory.value !== '' || currentStatus.value !== 0);

  const statusOptions = ['全部', '公开', '加密'];

  const loadMoreStatus = computed(() => {
    if (loading.value) return 'loading';
    if (list.value.length >= total.value && total.value > 0) return 'nomore';
    return 'loadmore';
  });

  const swipeOptions = [
    { text: '编辑', style: { backgroundColor: '#007aff' } },
    { text: '删除', style: { backgroundColor: '#dd524d' } },
  ];

  function getCategoryLabel(categoryVal: number | string) {
    const item = articleCategoryOption.value.find((opt) => opt.value === categoryVal);
    return item?.label || categoryVal;
  }

  async function loadData(isRefresh = false) {
    if (loading.value) return;
    if (isRefresh) {
      current.value = 1;
      list.value = [];
    }
    loading.value = true;
    try {
      const params: any = {
        current: current.value,
        size: pageSize,
      };
      if (keyword.value) {
        params.keywords = keyword.value;
      }
      if (currentCategory.value) {
        params.categoryVal = currentCategory.value;
      }
      if (currentStatus.value === 1) {
        params.isPrivate = false;
      } else if (currentStatus.value === 2) {
        params.isPrivate = true;
      }
      const res = await articleAPi.getFindPage(params);
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

  function onStatusChange(index: number) {
    currentStatus.value = index;
    loadData(true);
  }

  function onCategoryConfirm(e: any) {
    const index = Array.isArray(e) ? e[0] : e;
    currentCategory.value = categoryPickerOptions.value[index]?.value ?? '';
    loadData(true);
  }

  function goToAdd() {
    uni.navigateTo({ url: '/pages/blog/article-edit/article-edit' });
  }

  function goToEdit(articleId: string) {
    uni.navigateTo({ url: `/pages/blog/article-edit/article-edit?id=${articleId}` });
  }

  function onSwipeClick(event: any, item: ApiArticleItem) {
    const index = event.index;
    if (index === 0) {
      goToEdit(item.articleId);
    } else if (index === 1) {
      uni.showModal({
        title: '确认删除',
        content: `确定删除文章「${item.title}」？`,
        success: async (res) => {
          if (res.confirm) {
            await articleAPi.remove(item.articleId);
            loadData(true);
          }
        },
      });
    }
  }

  onMounted(() => {
    apiTypeStore.getArticleCategory();
    loadData(true);
    inited.value = true;
  });

  watch(
    () => props.active,
    (val) => {
      if (val && inited.value) {
        loadData(true);
      }
    }
  );
</script>

<style lang="scss" scoped>
  .article-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: $uni-bg-color-grey;
  }

  .article-toolbar {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 16rpx 20rpx;
    background-color: $uni-bg-color;
  }

  .article-toolbar-actions {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex-shrink: 0;
  }

  .article-toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8rpx;
  }

  .article-filter {
    margin: 0 20rpx 16rpx;
    background-color: $uni-bg-color;
    border-radius: 16rpx;
    padding: 20rpx 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  }

  .article-filter-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
  }

  .article-filter-row:last-child {
    margin-bottom: 0;
  }

  .article-filter-label {
    font-size: 26rpx;
    color: $uni-text-color-grey;
    flex-shrink: 0;
  }

  .article-filter-picker {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 12rpx 20rpx;
    background-color: #f5f5f5;
    border-radius: 8rpx;
    min-width: 160rpx;
    justify-content: flex-end;
  }

  .article-filter-value {
    font-size: 26rpx;
    color: $uni-text-color;
  }

  .article-filter-placeholder {
    font-size: 26rpx;
    color: $uni-text-color-placeholder;
  }

  .article-list-scroll {
    flex: 1;
    height: 0;
  }

  .article-refresher {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 0;
    gap: 12rpx;
  }

  .article-refresher-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .article-list {
    padding: 0 20rpx;
  }

  .article-loading,
  .article-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;
  }

  .article-loading-text {
    margin-top: 20rpx;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-sm;
  }

  .article-item {
    margin-bottom: 16rpx;
    padding: 24rpx;
  }

  .article-item-main {
    display: flex;
    align-items: flex-start;
    gap: 20rpx;
  }

  .article-item-icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .article-item-icon-public {
    background: linear-gradient(135deg, #4cd964, #34c759);
  }

  .article-item-icon-private {
    background: linear-gradient(135deg, #ff9500, #ff6b00);
  }

  .article-item-content {
    flex: 1;
    min-width: 0;
  }

  .article-item-header {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }

  .article-item-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .article-item-brief {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 8rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .article-item-footer {
    display: flex;
    align-items: center;
    gap: 24rpx;
    margin-top: 12rpx;
  }

  .article-item-meta {
    display: flex;
    align-items: center;
    gap: 6rpx;
  }

  .article-item-time {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-placeholder;
  }

  .article-item-author {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-placeholder;
  }

  .article-item-tags {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid #f0f0f0;
  }

  :deep(.u-fab-trigger-btn) {
    width: 88rpx !important;
    height: 88rpx !important;
    border-radius: 88rpx !important;
    box-shadow:
      0 8rpx 24rpx rgba(0, 122, 255, 0.25),
      0 2rpx 8rpx rgba(0, 0, 0, 0.08) !important;

    &::after {
      border-radius: 88rpx !important;
    }
  }
</style>
