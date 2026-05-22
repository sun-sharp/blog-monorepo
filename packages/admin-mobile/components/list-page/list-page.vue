<template>
  <view class="list-page">
    <view v-if="showSearch" class="list-page-search">
      <u-search
        v-model="keyword"
        :placeholder="searchPlaceholder"
        shape="round"
        :show-action="true"
        action-text="搜索"
        @search="handleSearch"
        @custom="handleSearch"
        @clear="handleClear" />
    </view>
    <u-dropdown v-if="dropdownItems.length > 0" class="list-page-dropdown">
      <u-dropdown-item
        v-for="(item, index) in dropdownItems"
        :key="index"
        v-model="item.value"
        :title="item.title"
        :options="item.options"
        @change="handleDropdownChange" />
    </u-dropdown>
    <scroll-view
      scroll-y
      class="list-page-scroll"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      refresher-default-style="none"
      @refresherrefresh="onPullDownRefresh"
      @scrolltolower="onReachBottom">
      <template #refresher>
        <view class="list-page-refresher">
          <u-loading v-if="isRefreshing" mode="circle" size="40" />
          <text class="list-page-refresher-text">{{ isRefreshing ? '刷新中...' : '下拉刷新' }}</text>
        </view>
      </template>
      <view v-if="loading && list.length === 0" class="list-page-loading">
        <u-loading mode="circle" size="60" />
        <text class="list-page-loading-text">加载中...</text>
      </view>
      <view v-else-if="!loading && list.length === 0" class="list-page-empty">
        <u-empty mode="data" text="暂无数据" icon-size="160" />
      </view>
      <view v-else class="list-page-content">
        <slot :list="list" />
        <u-loadmore :status="loadMoreStatus" @loadmore="loadMore" />
      </view>
    </scroll-view>
    <u-fab v-if="showFab" icon="plus" @click="$emit('fabClick')" />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';

  interface DropdownItem {
    title: string;
    options: { label: string; value: any }[];
    value: any;
    key: string;
  }

  const props = withDefaults(
    defineProps<{
      apiFn: (params: any) => Promise<any>;
      showSearch?: boolean;
      searchPlaceholder?: string;
      searchKey?: string;
      dropdownItems?: DropdownItem[];
      showFab?: boolean;
      pageSize?: number;
    }>(),
    {
      showSearch: true,
      searchPlaceholder: '请输入搜索关键词',
      searchKey: 'keywords',
      dropdownItems: () => [],
      showFab: false,
      pageSize: 10,
    }
  );

  const emit = defineEmits(['fabClick', 'loaded', 'searchSubmit']);

  const keyword = ref('');
  const list = ref<any[]>([]);
  const loading = ref(false);
  const isRefreshing = ref(false);
  const current = ref(1);
  const total = ref(0);

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
      const params: any = {
        current: current.value,
        size: props.pageSize,
      };
      if (props.showSearch && keyword.value) {
        params[props.searchKey] = keyword.value;
      }
      props.dropdownItems.forEach((item) => {
        if (item.value !== undefined && item.value !== null && item.value !== '') {
          params[item.key] = item.value;
        }
      });
      const res = await props.apiFn(params);
      if (isRefresh) {
        list.value = res.list || [];
      } else {
        list.value = [...list.value, ...(res.list || [])];
      }
      total.value = res.total || 0;
      emit('loaded', list.value);
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
    emit('searchSubmit', keyword.value);
    loadData(true);
  }

  function handleClear() {
    keyword.value = '';
    loadData(true);
  }

  function handleDropdownChange() {
    loadData(true);
  }

  function refresh() {
    loadData(true);
  }

  onMounted(() => {
    loadData(true);
  });

  defineExpose({ refresh, list });
</script>

<style lang="scss" scoped>
  .list-page {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 100rpx);
  }

  .list-page-search {
    padding: 16rpx 24rpx 0;
    background-color: $uni-bg-color;
  }

  .list-page-dropdown {
    background-color: $uni-bg-color;
  }

  .list-page-scroll {
    flex: 1;
    height: 0;
  }

  .list-page-refresher {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 0;
    gap: 12rpx;
  }

  .list-page-refresher-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .list-page-content {
    padding: 0 20rpx;
  }

  .list-page-loading,
  .list-page-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;
  }

  .list-page-loading-text {
    margin-top: 20rpx;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-sm;
  }
</style>
