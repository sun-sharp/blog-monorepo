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
    <view style="padding-bottom: 10rpx">
      <u-dropdown v-if="dropdownItems.length > 0" class="list-page-dropdown">
        <u-dropdown-item
          v-for="(item, index) in dropdownItems"
          :key="index"
          v-model="item.value"
          :title="item.title"
          :options="item.options"
          @change="handleDropdownChange" />
      </u-dropdown>
    </view>
    <scroll-view
      scroll-y
      class="list-page-scroll"
      :style="scrollStyle"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      refresher-default-style="black"
      @refresherrefresh="onPullDownRefresh"
      @scrolltolower="onReachBottom">
      <view v-if="loading && list.length === 0" class="list-page-loading">
        <u-loading mode="circle" size="60" />
        <text class="list-page-loading-text">加载中...</text>
      </view>
      <view v-if="!loading && list.length === 0" class="list-page-empty">
        <u-empty mode="data" text="暂无数据" icon-size="160" />
      </view>
      <view v-if="list.length > 0" class="list-page-content">
        <slot :list="list" />
        <u-loadmore :status="loadMoreStatus" @loadmore="loadMore" />
      </view>
    </scroll-view>
    <u-fab
      v-if="showFab"
      icon="plus"
      :size="88"
      :z-index="9999"
      btn-custom-style="box-shadow:0 8rpx 24rpx rgba(0,122,255,0.25),0 2rpx 8rpx rgba(0,0,0,0.08);"
      position="right-bottom"
      :gap="{ right: 30, bottom: 30 }"
      @trigger="$emit('fabClick')" />
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
      showFab: true,
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

  const scrollTopOffset = ref(0);

  const scrollStyle = computed(() => {
    return {};
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

  function calcScrollHeight() {
    try {
      const sysInfo = uni.getSystemInfoSync();
      const statusBarHeight = sysInfo.statusBarHeight || 0;
      const navBarHeight = 44;
      const searchHeight = props.showSearch ? 44 : 0;
      const dropdownHeight = props.dropdownItems.length > 0 ? 44 : 0;
      const extraPadding = 10;
      scrollTopOffset.value = statusBarHeight + navBarHeight + searchHeight + dropdownHeight + extraPadding;
    } catch {
      scrollTopOffset.value = 0;
    }
  }

  function refresh() {
    loadData(true);
  }

  onMounted(() => {
    calcScrollHeight();
    loadData(true);
  });

  defineExpose({ refresh, list });
</script>

<style lang="scss" scoped>
  .list-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
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
