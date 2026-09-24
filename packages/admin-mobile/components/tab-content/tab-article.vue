<template>
  <view class="article-page" :class="{ dark: isDark }">
    <view class="article-toolbar" :class="{ dark: isDark }">
      <u-search
        v-model="keyword"
        placeholder="搜索文章标题"
        shape="round"
        :show-action="true"
        action-text="搜索"
        :bg-color="isDark ? '#2a2a2e' : '#f5f5f5'"
        :input-color="isDark ? '#e8e8ea' : '#333'"
        :color="isDark ? '#e8e8ea' : '#333'"
        @search="handleSearch"
        @custom="handleSearch"
        @clear="handleClear" />
      <view class="article-toolbar-actions">
        <view class="article-toolbar-btn" @click="openFilterPopup">
          <u-icon name="setting" size="36" :color="hasActiveFilter ? '#007aff' : isDark ? '#b0b3b8' : '#666'" />
        </view>
      </view>
    </view>

    <view v-if="activeFilterTags.length > 0" class="article-filter">
      <view v-for="tag in activeFilterTags" :key="tag.field" class="article-filter-tag" :class="{ dark: isDark }" @click="clearFilterTag(tag.field)">
        <text class="article-filter-tag-text" :class="{ dark: isDark }">{{ tag.label }}</text>
        <u-icon name="close" size="24" :color="isDark ? '#7d8085' : '#999'" />
      </view>
    </view>

    <scroll-view
      scroll-y
      class="article-list-scroll"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      :refresher-default-style="isDark ? 'white' : 'black'"
      @refresherrefresh="onPullDownRefresh"
      @scrolltolower="onReachBottom">
      <view v-if="loading && list.length === 0" class="article-loading">
        <u-loading mode="circle" size="60" />
        <text class="article-loading-text">加载中...</text>
      </view>
      <view v-if="!loading && list.length === 0" class="article-empty">
        <u-empty mode="data" text="暂无文章" icon-size="160" />
      </view>
      <view v-if="list.length > 0" class="article-list">
        <view v-for="item in list" :key="item.articleId" class="article-item card" :class="{ dark: isDark }" @click="goToDetail(item.articleId)">
          <view class="article-item-main">
            <view class="article-item-icon" :class="item.isPrivate ? 'article-item-icon-private' : 'article-item-icon-public'">
              <u-icon :name="item.isPrivate ? 'lock' : 'file-text'" size="32" color="#fff" />
            </view>
            <view class="article-item-content">
              <view class="article-item-header">
                <text class="article-item-title" :class="{ dark: isDark }">{{ item.title }}</text>
                <u-tag v-if="item.isPrivate" text="加密" type="warning" size="mini" plain />
              </view>
              <text v-if="item.brief" class="article-item-brief" :class="{ dark: isDark }">{{ item.brief }}</text>
              <view class="article-item-footer">
                <view class="article-item-meta">
                  <u-icon name="calendar" size="22" :color="isDark ? '#7d8085' : '#999'" />
                  <text class="article-item-time" :class="{ dark: isDark }">{{ item.createTime?.slice(0, 10) }}</text>
                </view>
                <view class="article-item-meta">
                  <u-icon name="account" size="22" :color="isDark ? '#7d8085' : '#999'" />
                  <text class="article-item-author" :class="{ dark: isDark }">{{ item.authorNickname || '未知作者' }}</text>
                </view>
              </view>
            </view>
          </view>
          <view v-if="item.categoryVal" class="article-item-tags" :class="{ dark: isDark }">
            <u-tag :text="getCategoryLabel(item.categoryVal)" type="primary" size="mini" plain />
          </view>
        </view>
        <u-loadmore :status="loadMoreStatus" @loadmore="loadMore" />
      </view>
    </scroll-view>

    <!-- #ifndef MP-WEIXIN -->
    <view class="tab-article-fab" @click="goToAdd">
      <u-icon name="plus" size="44" color="#fff" />
    </view>
    <!-- #endif -->

    <u-popup v-model="showFilterPopup" mode="bottom" :border-radius="24" :safe-area-inset-bottom="true" @close="showFilterPopup = false">
      <view class="article-filter-popup" :class="{ dark: isDark }">
        <view class="article-filter-popup-header">
          <text class="article-filter-popup-title" :class="{ dark: isDark }">筛选</text>
          <view class="article-filter-popup-close" :class="{ dark: isDark }" @click="showFilterPopup = false">
            <u-icon name="close" size="36" :color="isDark ? '#7d8085' : '#999'" />
          </view>
        </view>
        <scroll-view scroll-y class="article-filter-popup-body">
          <view class="article-filter-popup-row" :class="{ dark: isDark }">
            <view class="article-filter-popup-label-row">
              <text class="article-filter-popup-label" :class="{ dark: isDark }">分类</text>
              <u-icon v-if="draftCategory" name="close-circle-fill" size="28" :color="isDark ? '#7d8085' : '#999'" @click="draftCategory = ''" />
            </view>
            <view class="article-filter-popup-select" :class="{ dark: isDark }" @click="showCategorySelect = true">
              <text :class="['article-filter-popup-select-value', !draftCategory && 'placeholder', isDark && 'dark']">
                {{ getCategoryOptionLabel(draftCategory) || '全部分类' }}
              </text>
              <u-icon name="arrow-right" size="24" :color="isDark ? '#7d8085' : '#999'" />
            </view>
          </view>
          <view class="article-filter-popup-row" :class="{ dark: isDark }">
            <view class="article-filter-popup-label-row">
              <text class="article-filter-popup-label" :class="{ dark: isDark }">状态</text>
              <u-icon v-if="draftStatus" name="close-circle-fill" size="28" :color="isDark ? '#7d8085' : '#999'" @click="draftStatus = 0" />
            </view>
            <u-subsection
              :list="statusOptions"
              :current="draftStatus"
              mode="button"
              active-color="#007aff"
              :inactive-color="isDark ? '#b0b3b8' : '#666666'"
              :bg-color="isDark ? '#2a2a2e' : '#f5f5f5'"
              size="mini"
              @change="onStatusChange" />
          </view>
        </scroll-view>
        <view class="article-filter-popup-footer" :class="{ dark: isDark }">
          <u-button @click="clearAllFilters">重置</u-button>
          <u-button type="primary" @click="onFilterConfirm">确定</u-button>
        </view>
      </view>
    </u-popup>

    <option-select
      ref="categorySelectRef"
      v-model="showCategorySelect"
      title="选择分类"
      :list="categoryOptionList"
      :current-value="draftCategory || undefined"
      :full-top-inset="true"
      @confirm="onCategoryConfirm" />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { consumeRefreshFlag } from '../../composables/useRefreshFlag';
  import { articleAPi } from '../../api';
  import { useApiTypeStore } from '../../store';
  import { useAppTheme } from '../../composables/useAppTheme';
  import type { ApiLiteArticleItem } from '/#/api/blog/article';
  import OptionSelect from '../option-select/option-select.vue';

  const props = defineProps<{ active: boolean }>();

  const apiTypeStore = useApiTypeStore();
  const { isDark } = useAppTheme();

  const keyword = ref('');
  const list = ref<ApiLiteArticleItem[]>([]);
  const loading = ref(false);
  const isRefreshing = ref(false);
  const current = ref(1);
  const total = ref(0);
  const inited = ref(false);
  const showFilterPopup = ref(false);
  const showCategorySelect = ref(false);
  const categorySelectRef = ref();
  // 已生效筛选
  const appliedCategory = ref<number | string>('');
  const appliedStatus = ref(0);
  // 弹窗草稿
  const draftCategory = ref<number | string>('');
  const draftStatus = ref(0);

  const pageSize = 20;

  const articleCategoryOption = computed(() => apiTypeStore.getArticleCategoryOption);

  const categoryOptionList = computed(() => articleCategoryOption.value as unknown as { label: string; value: number | string }[]);

  const statusOptions = ['全部', '公开', '加密'];

  const loadMoreStatus = computed(() => {
    if (loading.value) return 'loading';
    if (list.value.length >= total.value && total.value > 0) return 'nomore';
    return 'loadmore';
  });

  function getCategoryOptionLabel(categoryVal: number | string | undefined): string {
    if (categoryVal === undefined || categoryVal === '' || categoryVal === null) return '';
    const item = articleCategoryOption.value.find((opt) => opt.value === categoryVal);
    return item?.label || '';
  }

  const hasActiveFilter = computed(() => appliedCategory.value !== '' || appliedStatus.value !== 0);

  const activeFilterTags = computed(() => {
    const tags: { field: string; label: string }[] = [];
    if (appliedCategory.value !== '') {
      tags.push({ field: 'categoryVal', label: getCategoryOptionLabel(appliedCategory.value) || '全部分类' });
    }
    if (appliedStatus.value !== 0) {
      tags.push({ field: 'status', label: statusOptions[appliedStatus.value] });
    }
    return tags;
  });

  function openFilterPopup() {
    draftCategory.value = appliedCategory.value;
    draftStatus.value = appliedStatus.value;
    showFilterPopup.value = true;
  }

  function clearAllFilters() {
    draftCategory.value = '';
    draftStatus.value = 0;
  }

  function clearFilterTag(field: string) {
    if (field === 'categoryVal') {
      appliedCategory.value = '';
    } else if (field === 'status') {
      appliedStatus.value = 0;
    }
    loadData(true);
  }

  function onFilterConfirm() {
    showFilterPopup.value = false;
    appliedCategory.value = draftCategory.value;
    appliedStatus.value = draftStatus.value;
    loadData(true);
  }

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
      if (appliedCategory.value) {
        params.categoryVal = appliedCategory.value;
      }
      if (appliedStatus.value === 1) {
        params.isPrivate = false;
      } else if (appliedStatus.value === 2) {
        params.isPrivate = true;
      }
      const res = await articleAPi.getLitePage(params);
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
    draftStatus.value = index;
  }

  function onCategoryConfirm(item: any) {
    const selected = Array.isArray(item) ? item[0] : item;
    draftCategory.value = selected?.value ?? '';
  }

  function goToAdd() {
    // #ifndef MP-WEIXIN
    uni.navigateTo({ url: '/pages/blog/article-edit/article-edit' });
    // #endif
  }

  function goToDetail(articleId: string) {
    uni.navigateTo({ url: `/pages/blog/article-detail/article-detail?id=${articleId}` });
  }

  onMounted(() => {
    apiTypeStore.getArticleCategory();
    loadData(true);
    inited.value = true;
  });

  function checkRefresh() {
    if (inited.value && consumeRefreshFlag('article')) {
      loadData(true);
    }
  }

  watch(
    () => props.active,
    (val) => {
      if (val && inited.value && consumeRefreshFlag('article')) {
        loadData(true);
      }
    }
  );

  defineExpose({
    checkRefresh,
    isFullFilterVisible: () => {
      const sel = categorySelectRef.value;
      return !!(sel && typeof sel.isFullFilterVisible === 'function' && sel.isFullFilterVisible());
    },
    closeFullFilter: () => {
      const sel = categorySelectRef.value;
      if (sel && typeof sel.closeFullFilter === 'function' && sel.isFullFilterVisible()) {
        sel.closeFullFilter();
        return true;
      }
      return false;
    },
  });
</script>

<style lang="scss" scoped>
  .article-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: $uni-bg-color-grey;
    transition: background-color 0.2s;

    &.dark {
      background-color: $dark-page-bg;
    }
  }

  .article-toolbar {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 16rpx 20rpx;
    background-color: $uni-bg-color;
    transition: background-color 0.2s;

    &.dark {
      background-color: $dark-page-bg;
    }
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
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-wrap: wrap;
  }

  .article-filter-tag {
    display: inline-flex;
    align-items: center;
    gap: 8rpx;
    background-color: #e8f4fd;
    border-radius: 20rpx;
    padding: 8rpx 20rpx;

    &.dark {
      background-color: $dark-chip-bg;
    }
  }

  .article-filter-tag-text {
    font-size: 24rpx;
    color: #007aff;

    &.dark {
      color: #4d9fff;
    }
  }

  .article-filter-popup {
    display: flex;
    flex-direction: column;
    max-height: 70vh;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
    background-color: $uni-bg-color;
    transition: background-color 0.2s;

    &.dark {
      background-color: $dark-card-bg;
    }
  }

  .article-filter-popup-header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 32rpx 30rpx 16rpx;
  }

  .article-filter-popup-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $uni-text-color;

    &.dark {
      color: $dark-text-color;
    }
  }

  .article-filter-popup-close {
    position: absolute;
    right: 24rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 56rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: #f5f5f5;

    &.dark {
      background-color: $dark-chip-bg;
    }
  }

  .article-filter-popup-body {
    flex: 1;
    padding: 0 30rpx;
    max-height: 50vh;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  .article-filter-popup-row {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    overflow: hidden;
    &:last-child {
      border-bottom: none;
    }

    &.dark {
      border-bottom-color: $dark-border-color;
    }
  }

  .article-filter-popup-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12rpx;
  }

  .article-filter-popup-label {
    font-size: 26rpx;
    color: #666;

    &.dark {
      color: $dark-text-color-2;
    }
  }

  .article-filter-popup-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 20rpx;
    background-color: #f5f5f5;
    border-radius: 12rpx;

    &.dark {
      background-color: $dark-input-bg;
    }
  }

  .article-filter-popup-select-value {
    font-size: 26rpx;
    color: #333;
    &.placeholder {
      color: #999;
    }
    &.dark {
      color: $dark-text-color;
      &.placeholder {
        color: $dark-text-color-3;
      }
    }
  }

  .article-filter-popup-footer {
    display: flex;
    gap: 20rpx;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    border-top: 1rpx solid #f0f0f0;

    &.dark {
      border-top-color: $dark-border-color;
    }
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

    &.dark {
      color: $dark-text-color;
    }
  }

  .article-item-brief {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 8rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    &.dark {
      color: $dark-text-color-3;
    }
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

    &.dark {
      color: $dark-text-color-3;
    }
  }

  .article-item-author {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-placeholder;

    &.dark {
      color: $dark-text-color-3;
    }
  }

  .article-item-tags {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid #f0f0f0;

    &.dark {
      border-top-color: $dark-border-color;
    }
  }

  .tab-article-fab {
    position: fixed;
    right: 60rpx;
    bottom: calc(140rpx + env(safe-area-inset-bottom));
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #007aff, #0055d5);
    box-shadow:
      0 8rpx 24rpx rgba(0, 122, 255, 0.35),
      0 2rpx 8rpx rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    &:active {
      transform: scale(0.9);
    }
  }
</style>
