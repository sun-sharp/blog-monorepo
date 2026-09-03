<template>
  <view class="list-page" :class="{ dark: isDark }">
    <view v-if="showSearch" class="list-page-search" :class="{ dark: isDark }">
      <u-search
        v-model="keyword"
        :placeholder="searchPlaceholder"
        shape="round"
        :show-action="false"
        action-text="搜索"
        @search="handleSearch"
        @custom="handleSearch"
        @clear="handleClear" />
    </view>

    <view v-if="enabledItems.length > 0" class="list-page-filterbar" :class="{ dark: isDark }">
      <scroll-view scroll-x class="list-page-filterbar__scroll" :show-scrollbar="false">
        <view class="list-page-filterbar__row">
          <view
            v-for="(item, index) in allQueryItems"
            :key="index"
            class="filter-chip"
            :class="{ 'filter-chip--active': isQueryValueSet(item), 'filter-chip--open': activeInlineKey === item.key }"
            @click="onQueryBarChipClick(item)">
            <text class="filter-chip__text">{{ getQueryButtonTitle(item) }}</text>
            <u-icon name="arrow-down" size="20" color="#999" />
          </view>
        </view>
      </scroll-view>

      <!-- 内联下拉面板：absolute 悬浮在查询栏下方，不挤压列表 -->
      <view v-if="activeInlineKey !== '' && activeInlineField" class="list-page-inline-panel" :class="{ dark: isDark }" @touchmove.stop.prevent @click.stop>
        <view class="inline-panel__chips">
          <view
            v-for="opt in activeInlineField.options"
            :key="opt.value"
            class="filter-chip"
            :class="{ 'filter-chip--selected': inlineDraftValue === opt.value }"
            @click="onInlineSelect(opt)">
            <text class="filter-chip__text">{{ opt.label }}</text>
          </view>
        </view>
      </view>
    </view>

    <scroll-view
      scroll-y
      class="list-page-scroll"
      :style="scrollStyle"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      refresher-default-style="black"
      :scroll-with-animation="false"
      @refresherrefresh="onPullDownRefresh"
      @scrolltolower="onReachBottom"
      @scroll="onScroll">
      <view class="list-page-scroll-mask" @click="closeInlinePanel">
        <view v-if="loading && list.length === 0" class="list-page-loading">
          <u-loading mode="circle" size="60" />
          <text class="list-page-loading-text">加载中...</text>
        </view>
        <view v-if="!loading && list.length === 0" class="list-page-empty">
          <u-empty mode="data" text="暂无数据" icon-size="160" />
        </view>
        <view v-if="list.length > 0" class="list-page-content">
          <slot :list="list" :longpress="onLongPress" />
          <u-loadmore :status="loadMoreStatus" @loadmore="loadMore" />
        </view>
      </view>
    </scroll-view>

    <view v-if="showFab" class="list-page-fab" @click="$emit('fabClick')">
      <u-icon name="plus" size="44" color="#fff" />
    </view>

    <!-- 底部半屏弹窗：多字段聚合，chip 单选高亮 -->
    <u-popup
      v-if="bottomItems.length > 0"
      :model-value="showBottomFilter"
      mode="bottom"
      :length="'55%'"
      :safe-area-inset-bottom="true"
      :border-radius="24"
      @close="showBottomFilter = false">
      <view class="bottom-filter">
        <view class="bottom-filter__header">
          <text class="bottom-filter__title">{{ activeBottomField ? activeBottomField.title : '筛选' }}</text>
          <view class="bottom-filter__close" @click="showBottomFilter = false">
            <u-icon name="close" size="36" color="#999" />
          </view>
        </view>
        <view v-if="activeBottomField" class="bottom-filter__body">
          <view class="bottom-filter__chips">
            <view
              v-for="opt in activeBottomField.options"
              :key="opt.value"
              class="bottom-filter-chip"
              :class="{ 'bottom-filter-chip--selected': bottomDraft[activeBottomField.key] === opt.value }"
              @click="onChipSelect(activeBottomField, opt)">
              <text class="bottom-filter-chip__text">{{ opt.label }}</text>
            </view>
          </view>
        </view>
        <view class="bottom-filter__footer">
          <u-button size="large" @click="resetBottom">重置</u-button>
          <u-button size="large" type="primary" @click="confirmBottom">确定</u-button>
        </view>
      </view>
    </u-popup>

    <!-- 全屏弹窗：ABC 拼音索引定位 + 搜索 -->
    <u-popup
      v-if="fullItems.length > 0"
      :model-value="showFullFilter"
      mode="right"
      :length="'100%'"
      :safe-area-inset-bottom="true"
      @close="showFullFilter = false">
      <view class="full-filter">
        <view class="full-filter__search-row">
          <view class="full-filter__search">
            <u-search v-model="fullKeyword" placeholder="搜索选项" shape="round" :show-action="false" @clear="fullKeyword = ''" />
          </view>
          <view class="full-filter__close" @click="showFullFilter = false">
            <u-icon name="close" size="36" color="#999" />
          </view>
        </view>
        <scroll-view scroll-y scroll-with-animation class="full-filter__scroll" :scroll-into-view="fullScrollIntoView">
          <view v-for="field in visibleFullItems" :key="'ff' + field._id" class="full-filter__group">
            <view :id="`full-group-${field._id}`" class="full-filter__group-title">{{ field._letter }}</view>
            <view class="full-filter__chips">
              <view
                v-for="opt in field._options"
                :key="opt.value"
                class="filter-chip"
                :class="{ 'filter-chip--selected': field.value === opt.value }"
                @click="onFullChipSelect(field, opt)">
                <text class="filter-chip__text">{{ opt.label }}</text>
              </view>
            </view>
          </view>
          <view v-if="visibleFullItems.length === 0" class="full-filter__empty">
            <u-empty mode="search" text="无匹配选项" icon-size="80" />
          </view>
        </scroll-view>
        <view class="full-filter__index">
          <text v-for="letter in fullIndexLetters" :key="letter" class="full-filter__index-item" @click="jumpToLetter(letter)">{{ letter }}</text>
        </view>
        <view class="full-filter__footer">
          <u-button @click="resetFull">重置</u-button>
          <u-button type="primary" @click="confirmFull">确定</u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { getPinyinInitial } from '../../../shared/src/utils';
  import { useAppTheme } from '../../composables/useAppTheme';

  const { isDark } = useAppTheme();

  export interface ListDropdownItem {
    title: string;
    options: { label: string; value: any }[];
    value: any;
    key: string;
    mode?: 'inline' | 'bottom' | 'full';
  }

  interface FullGroup {
    _id: string;
    _letter: string;
    _options: { label: string; value: any }[];
    title: string;
    key: string;
    value: any;
  }

  const props = withDefaults(
    defineProps<{
      apiFn: (params: any) => Promise<any>;
      showSearch?: boolean;
      searchPlaceholder?: string;
      searchKey?: string;
      dropdownItems?: ListDropdownItem[];
      showFab?: boolean;
      pageSize?: number;
      inlineThreshold?: number;
      fullThreshold?: number;
    }>(),
    {
      showSearch: true,
      searchPlaceholder: '请输入搜索关键词',
      searchKey: 'keywords',
      dropdownItems: () => [],
      showFab: true,
      pageSize: 20,
      inlineThreshold: 5,
      fullThreshold: 20,
    }
  );

  const emit = defineEmits(['fabClick', 'loaded', 'searchSubmit', 'itemLongpress', 'filterChange']);

  const keyword = ref('');
  const list = ref<any[]>([]);
  const loading = ref(false);
  const isRefreshing = ref(false);
  const current = ref(1);
  const total = ref(0);

  const scrollTopOffset = ref(0);
  const scrollStyle = computed(() => ({}));

  // ---- 模式推断 ----
  function inferMode(item: ListDropdownItem): 'inline' | 'bottom' | 'full' {
    if (item.mode) return item.mode;
    const count = item.options ? item.options.length : 0;
    if (count <= props.inlineThreshold) return 'inline';
    if (count < props.fullThreshold) return 'bottom';
    return 'full';
  }

  type NormalizedItem = ListDropdownItem & { mode: 'inline' | 'bottom' | 'full'; _srcIndex: number };

  // 本地维护筛选状态（避免直接改 props），初始值来自 props.dropdownItems
  const stateItems = ref<NormalizedItem[]>(props.dropdownItems.map((item, index) => ({ ...item, mode: inferMode(item), _srcIndex: index })));
  const normalizedItems = computed(() => stateItems.value);

  const enabledItems = computed(() => normalizedItems.value);
  const bottomItems = computed(() => normalizedItems.value.filter((i) => i.mode === 'bottom'));
  const fullItems = computed(() => normalizedItems.value.filter((i) => i.mode === 'full'));

  // 查询栏上一行展示所有筛选条件（内联/底部/全屏统一 chip）
  const allQueryItems = computed(() => normalizedItems.value);

  // 内联下拉面板状态
  const activeInlineKey = ref('');
  const inlineDraftValue = ref<any>('');
  const activeInlineField = computed(() => normalizedItems.value.find((i) => i.key === activeInlineKey.value && i.mode === 'inline') || null);

  // 打开底部半屏弹窗/全屏弹窗时关闭内联面板
  function closeInlinePanel() {
    activeInlineKey.value = '';
    inlineDraftValue.value = '';
  }

  // props 数组引用变化时重新初始化本地筛选状态
  watch(
    () => props.dropdownItems,
    (val) => {
      if (!val || val.length === 0) return;
      stateItems.value = val.map((item, index) => ({ ...item, mode: inferMode(item), _srcIndex: index }));
    }
  );

  // 弹窗副本
  const bottomDraft = ref<Record<string, any>>({});
  const showBottomFilter = ref(false);

  const fullDraft = ref<FullGroup[]>([]);
  const showFullFilter = ref(false);
  const fullKeyword = ref('');
  const fullScrollIntoView = ref('');

  function isQueryValueSet(item: ListDropdownItem): boolean {
    return item.value !== undefined && item.value !== null && item.value !== '';
  }

  function getQueryButtonTitle(item: ListDropdownItem): string {
    if (isQueryValueSet(item)) {
      const found = item.options.find((o) => String(o.value) === String(item.value));
      return found ? found.label : item.title;
    }
    return item.title;
  }

  // ---- 查询栏 chip 点击 ----
  function onQueryBarChipClick(item: ListDropdownItem) {
    if (item.mode === 'inline') {
      if (activeInlineKey.value === item.key) {
        closeInlinePanel();
        return;
      }
      activeInlineKey.value = item.key;
      inlineDraftValue.value = item.value;
      return;
    }
    if (item.mode === 'bottom') {
      closeInlinePanel();
      openModeFilter(item);
      return;
    }
    // full
    closeInlinePanel();
    openFullFilter();
  }

  function onInlineSelect(opt: { label: string; value: any }) {
    const field = activeInlineField.value;
    if (!field) return;
    field.value = opt.value;
    closeInlinePanel();
    handleDropdownChange();
  }

  // ---- 底部弹窗（一次只展示一个筛选项）----
  const activeBottomKey = ref('');

  function openModeFilter(item?: ListDropdownItem) {
    const key = item ? item.key : (bottomItems.value[0]?.key ?? '');
    activeBottomKey.value = key;
    const field = item || activeBottomField.value;
    // 用该项当前值初始化草稿，打开时当前已生效的选项即高亮
    bottomDraft.value = { [key]: field ? field.value : '' };
    showBottomFilter.value = true;
  }

  const activeBottomField = computed(() => bottomItems.value.find((f) => f.key === activeBottomKey.value) || null);

  function onChipSelect(field: ListDropdownItem, opt: { label: string; value: any }) {
    bottomDraft.value[field.key] = opt.value;
  }

  function resetBottom() {
    if (activeBottomField.value) {
      bottomDraft.value[activeBottomField.value.key] = '';
    }
  }

  function confirmBottom() {
    const field = activeBottomField.value;
    if (field && bottomDraft.value[field.key] !== undefined) {
      field.value = bottomDraft.value[field.key];
    }
    showBottomFilter.value = false;
    handleDropdownChange();
  }

  // ---- 全屏弹窗 ----
  function buildFullGroups(items: ListDropdownItem[]): FullGroup[] {
    const groups: FullGroup[] = [];
    items.forEach((field) => {
      const map: Record<string, { label: string; value: any }[]> = {};
      field.options.forEach((opt) => {
        const letter = getPinyinInitial(opt.label);
        if (!map[letter]) map[letter] = [];
        map[letter].push(opt);
      });
      Object.keys(map)
        .sort()
        .forEach((letter) => {
          groups.push({
            _id: `${field.key}-${letter}`,
            _letter: letter,
            _options: map[letter],
            title: field.title,
            key: field.key,
            value: field.value,
          });
        });
    });
    return groups;
  }

  function openFullFilter() {
    fullDraft.value = buildFullGroups(fullItems.value);
    fullKeyword.value = '';
    fullScrollIntoView.value = '';
    showFullFilter.value = true;
  }

  function onFullChipSelect(field: FullGroup, opt: { label: string; value: any }) {
    fullDraft.value
      .filter((g) => g.key === field.key)
      .forEach((g) => {
        g.value = opt.value;
      });
  }

  const visibleFullItems = computed(() => {
    const kw = fullKeyword.value.trim().toLowerCase();
    if (!kw) return fullDraft.value;
    return fullDraft.value
      .map((group) => ({
        ...group,
        _options: group._options.filter((o) => String(o.label).toLowerCase().includes(kw)),
      }))
      .filter((g) => g._options.length > 0);
  });

  const fullIndexLetters = computed(() => Array.from(new Set(visibleFullItems.value.map((g) => g._letter))).sort());

  function jumpToLetter(letter: string) {
    const group = visibleFullItems.value.find((g) => g._letter === letter);
    if (group) fullScrollIntoView.value = `full-group-${group._id}`;
  }

  function resetFull() {
    fullDraft.value.forEach((g) => {
      g.value = '';
    });
  }

  function confirmFull() {
    fullItems.value.forEach((f) => {
      const match = fullDraft.value.find((g) => g.key === f.key);
      if (match) f.value = match.value;
    });
    showFullFilter.value = false;
    handleDropdownChange();
  }

  // ---- 暴露给页面 (onBackPress 关闭全屏) ----
  function isFullFilterVisible(): boolean {
    return showFullFilter.value;
  }
  function closeFullFilter(): boolean {
    if (showFullFilter.value) {
      showFullFilter.value = false;
      return true;
    }
    return false;
  }

  defineExpose({ refresh, list, isFullFilterVisible, closeFullFilter });

  let lastScrollTime = 0;
  let lastScrollTop = 0;

  function onScroll(e: any) {
    const scrollTop = e.detail?.scrollTop ?? 0;
    if (Math.abs(scrollTop - lastScrollTop) > 1) {
      lastScrollTime = Date.now();
    }
    lastScrollTop = scrollTop;
  }

  function onLongPress(item: any) {
    if (Date.now() - lastScrollTime < 350) return;
    emit('itemLongpress', item);
  }

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
      normalizedItems.value.forEach((item) => {
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
    const values: Record<string, any> = {};
    normalizedItems.value.forEach((n) => {
      values[n.key] = n.value;
    });
    emit('filterChange', values);
    loadData(true);
  }

  function calcScrollHeight() {
    try {
      const sysInfo = uni.getSystemInfoSync();
      const statusBarHeight = sysInfo.statusBarHeight || 0;
      const navBarHeight = 44;
      const searchHeight = props.showSearch ? 44 : 0;
      let filterHeight = 0;
      if (enabledItems.value.length > 0) {
        filterHeight = 44;
      }
      const extraPadding = 10;
      scrollTopOffset.value = statusBarHeight + navBarHeight + searchHeight + filterHeight + extraPadding;
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
</script>

<style lang="scss" scoped>
  .list-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */

    &.dark {
      .list-page-search {
        background-color: $uni-bg-color-dark-2;
      }

      .list-page-filterbar {
        background-color: $uni-bg-color-dark-2;
      }

      .list-page-inline-panel {
        background-color: $uni-bg-color-dark-2;
      }

      .bottom-filter {
        background-color: $uni-bg-color-dark-2;
      }

      .full-filter {
        background-color: $uni-bg-color-dark-2;
      }

      .bottom-filter__title {
        color: $uni-text-color-inverse;
      }

      .bottom-filter__close {
        background-color: #2a2a2e;
      }

      .bottom-filter__group-label {
        color: $uni-text-color-grey;
      }

      .full-filter__close {
        background-color: #2a2a2e;
      }

      .full-filter__group-title {
        color: #007aff;
        border-bottom-color: #3a4251;
      }

      .full-filter__empty {
        color: $uni-text-color-grey;
      }

      .filter-chip {
        background-color: #2a2a2e;
        color: #cfd3dc;

        &--selected {
          background-color: #007aff;
          color: #fff;
          border: 1rpx solid #007aff;
        }

        &--active {
          color: #8ab4ff;
        }

        &--open {
          background-color: rgba(0, 122, 255, 0.2);
          color: #8ab4ff;
        }
      }

      .bottom-filter-chip {
        background-color: #2a2a2e;
        color: #cfd3dc;

        &--selected {
          background-color: #007aff;
          color: #fff;
          border: 1rpx solid #007aff;
        }
      }
    }
  }

  .list-page-search {
    padding: 16rpx 24rpx 12rpx;
    background-color: $uni-bg-color;
  }

  .list-page-filterbar {
    position: relative;
    z-index: 30;
    background-color: $uni-bg-color;
    border-bottom: 1rpx solid #f0f0f0;
    padding: 10rpx 16rpx;
  }

  .list-page-filterbar__scroll {
    white-space: nowrap;
    width: 100%;
  }

  .list-page-filterbar__row {
    display: inline-flex;
    align-items: center;
    gap: 12rpx;
  }

  /* 内联下拉面板：absolute 悬浮，不挤压列表 */
  .list-page-inline-panel {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    z-index: 40;
    background-color: $uni-bg-color;
    padding: 16rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
    border-bottom: 1rpx solid #f0f0f0;
  }

  .inline-panel__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }

  .list-page-scroll {
    flex: 1;
    height: 0;
  }

  .list-page-scroll-mask {
    min-height: 100%;
  }

  .filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 6rpx;
    padding: 10rpx 20rpx;
    background-color: #f5f6f8;
    border-radius: 28rpx;
    font-size: 26rpx;
    color: #333;
    flex-shrink: 0;

    &--active {
      color: #007aff;
    }

    &--open {
      background-color: #e8f4fd;
      color: #007aff;
    }

    &--selected {
      background-color: #e8f4fd;
      color: #007aff;
      border: 1rpx solid #007aff;
    }

    .filter-chip__text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .bottom-filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 6rpx;
    padding: 12rpx 24rpx;
    background-color: #f5f6f8;
    border-radius: 28rpx;
    font-size: 26rpx;
    color: #333;

    &--selected {
      background-color: #e8f4fd;
      color: #007aff;
      border: 1rpx solid #007aff;
    }

    .bottom-filter-chip__text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
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

  .list-page-fab {
    position: fixed;
    right: 30rpx;
    bottom: 60rpx;
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

  /* ---- 底部半屏弹窗 ---- */
  .bottom-filter {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24rpx 24rpx 0;
    box-sizing: border-box;
  }

  .bottom-filter__header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 0 0 20rpx;
  }

  .bottom-filter__title {
    font-size: 32rpx;
    font-weight: 600;
    color: $uni-text-color;
  }

  .bottom-filter__close {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bottom-filter__body {
    flex: 1;
  }

  .bottom-filter__group {
    margin-bottom: 28rpx;
  }

  .bottom-filter__group-label {
    font-size: 28rpx;
    font-weight: 600;
    color: $uni-text-color;
    margin-bottom: 16rpx;
    display: block;
  }

  .bottom-filter__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }

  .bottom-filter__footer {
    display: flex;
    gap: 20rpx;
    padding: 20rpx 0;
    padding-bottom: 20rpx;
  }

  /* ---- 全屏弹窗 ---- */
  .full-filter {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24rpx 24rpx 0;
    box-sizing: border-box;
    position: relative;
  }

  .full-filter__search-row {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding-bottom: 16rpx;
  }

  .full-filter__search {
    flex: 1;
  }

  .full-filter__close {
    flex-shrink: 0;
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .full-filter__scroll {
    flex: 1;
    height: 0;
    padding-right: 48rpx;
  }

  .full-filter__group {
    margin-bottom: 24rpx;
  }

  .full-filter__group-title {
    font-size: 26rpx;
    font-weight: 700;
    color: #007aff;
    padding: 8rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    margin-bottom: 16rpx;
  }

  .full-filter__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }

  .full-filter__empty {
    padding-top: 120rpx;
  }

  .full-filter__index {
    position: fixed;
    right: 8rpx;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    z-index: 20;
  }

  .full-filter__index-item {
    font-size: 20rpx;
    color: #007aff;
    padding: 3rpx 2rpx;
    text-align: center;
    line-height: 2;
  }

  .full-filter__footer {
    display: flex;
    gap: 20rpx;
    padding: 20rpx 0;
    padding-bottom: 40rpx;
  }
</style>
