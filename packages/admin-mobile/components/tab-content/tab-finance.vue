<template>
  <view class="finance-page">
    <view class="finance-header card">
      <view class="finance-summary-row">
        <view class="finance-summary-item">
          <text class="finance-summary-label">总收入</text>
          <text class="finance-summary-value money-inflow">¥{{ inflowTotal }}</text>
        </view>
        <view class="finance-summary-divider" />
        <view class="finance-summary-item">
          <text class="finance-summary-label">总支出</text>
          <text class="finance-summary-value money-outflow">¥{{ outflowTotal }}</text>
        </view>
      </view>
    </view>

    <view class="finance-toolbar">
      <u-search
        v-model="keyword"
        placeholder="搜索交易对方/说明"
        shape="round"
        :show-action="true"
        action-text="搜索"
        @search="handleSearch"
        @custom="handleSearch"
        @clear="handleClear" />
      <view class="finance-toolbar-actions">
        <view class="finance-toolbar-btn" @click="showTimeSelect = true">
          <u-icon name="calendar" size="36" :color="timeLabel ? '#007aff' : '#666'" />
        </view>
        <view class="finance-toolbar-btn" @click="showFilter = !showFilter">
          <u-icon name="setting" size="36" :color="showFilter ? '#007aff' : '#666'" />
        </view>
      </view>
    </view>

    <view v-if="showFilter || timeLabel" class="finance-filter">
      <view v-if="timeLabel" class="finance-filter-time-tag" @click="clearTimeRange">
        <u-icon name="calendar" size="24" color="#007aff" />
        <text class="finance-filter-time-text">{{ timeLabel }}</text>
        <u-icon name="close" size="24" color="#999" />
      </view>
      <view v-if="showFilter" class="finance-filter-row">
        <text class="finance-filter-label">来源</text>
        <u-subsection
          :list="sourceOptions"
          :current="currentSource"
          mode="button"
          active-color="#007aff"
          inactive-color="#666666"
          bg-color="#f5f5f5"
          size="mini"
          @change="onSourceChange" />
      </view>
      <view v-if="showFilter" class="finance-filter-row">
        <text class="finance-filter-label">收支</text>
        <u-subsection
          :list="flowOptions"
          :current="currentFlow"
          mode="button"
          active-color="#007aff"
          inactive-color="#666666"
          bg-color="#f5f5f5"
          size="mini"
          @change="onFlowChange" />
      </view>
    </view>

    <scroll-view
      scroll-y
      class="finance-list-scroll"
      :style="scrollStyle"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      refresher-default-style="black"
      @refresherrefresh="onPullDownRefresh"
      @scrolltolower="onReachBottom">
      <view v-if="loading && list.length === 0" class="finance-loading">
        <u-loading mode="circle" size="60" />
        <text class="finance-loading-text">加载中...</text>
      </view>
      <view v-if="!loading && list.length === 0" class="finance-empty">
        <u-empty mode="data" text="暂无账单" icon-size="160" />
      </view>
      <view v-if="list.length > 0" class="finance-list">
        <template v-for="(group, date) in groupedByDate" :key="date">
          <view class="finance-date-header">
            <text class="finance-date-text">{{ date }}</text>
          </view>
          <view v-for="item in group" :key="item.id" class="finance-bill-item card" @click="goToDetail(item)">
            <view class="finance-bill-left">
              <view :class="['finance-bill-icon', item.inflowOrOutflow === 1 ? 'finance-bill-icon-in' : 'finance-bill-icon-out']">
                <u-icon :name="getSourceIcon(item.source)" size="32" color="#fff" />
              </view>
              <view class="finance-bill-info">
                <text class="finance-bill-title">{{ item.tradeOtherPerson || item.explain || '--' }}</text>
                <text class="finance-bill-sub">{{ getSourceLabel(item.source) }} · {{ item.tradeTime?.slice(11, 16) || '' }}</text>
              </view>
            </view>
            <view class="finance-bill-right">
              <text :class="item.inflowOrOutflow === 1 ? 'money-inflow' : 'money-outflow'" class="finance-bill-amount">
                {{ item.inflowOrOutflow === 1 ? '+' : '-' }}¥{{ item.moneyAmount }}
              </text>
            </view>
          </view>
        </template>
        <u-loadmore :status="loadMoreStatus" @loadmore="loadMore" />
      </view>
    </scroll-view>

    <u-fab
      icon="plus"
      :size="88"
      btn-custom-style="box-shadow:0 8rpx 24rpx rgba(0,122,255,0.25),0 2rpx 8rpx rgba(0,0,0,0.08);"
      position="right-bottom"
      :gap="{ right: 60, bottom: 150 }"
      @trigger="showFabMenu = !showFabMenu" />
    <u-popup :model-value="showFabMenu" mode="bottom" :border-radius="24" :safe-area-inset-bottom="true" @close="showFabMenu = false">
      <view class="finance-fab-popup">
        <view class="finance-fab-popup-header">
          <text class="finance-fab-popup-title">快捷操作</text>
          <view class="finance-fab-popup-close" @click="showFabMenu = false">
            <u-icon name="close" size="36" color="#999" />
          </view>
        </view>
        <view class="finance-fab-popup-body">
          <view class="finance-fab-action-item" @click="onFabAction('upload')">
            <view class="finance-fab-action-icon" style="background-color: #e8f4fd">
              <u-icon name="download" size="40" color="#007aff" />
            </view>
            <view class="finance-fab-action-content">
              <text class="finance-fab-action-label">导入账单</text>
              <text class="finance-fab-action-desc">上传银行/支付宝/微信账单</text>
            </view>
            <u-icon name="arrow-right" size="32" color="#ccc" />
          </view>
          <view class="finance-fab-action-item" @click="onFabAction('summary')">
            <view class="finance-fab-action-icon" style="background-color: #fef5e0">
              <u-icon name="grid" size="40" color="#f0ad4e" />
            </view>
            <view class="finance-fab-action-content">
              <text class="finance-fab-action-label">财务汇总</text>
              <text class="finance-fab-action-desc">查看收支统计与图表分析</text>
            </view>
            <u-icon name="arrow-right" size="32" color="#ccc" />
          </view>
        </view>
      </view>
    </u-popup>

    <money-time-select v-model:show="showTimeSelect" @confirm="onTimeConfirm" />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { bankApi, weChatApi, aliPayApi } from '../../api';
  import MoneyTimeSelect from '../money-time-select/money-time-select.vue';

  const props = defineProps<{ active: boolean }>();

  interface BillItem {
    id: string;
    source: string;
    tradeTime: string;
    tradeOtherPerson: string;
    explain: string;
    moneyAmount: number;
    inflowOrOutflow: number;
    balance?: number;
    rawItem: any;
  }

  const keyword = ref('');
  const list = ref<BillItem[]>([]);
  const loading = ref(false);
  const isRefreshing = ref(false);
  const total = ref(0);
  const currentSource = ref(0);
  const currentFlow = ref(0);
  const showTimeSelect = ref(false);
  const showFabMenu = ref(false);
  const showFilter = ref(false);
  const timeRange = ref<{ startTime: string; endTime: string } | null>(null);
  const inflowTotal = ref('0.00');
  const outflowTotal = ref('0.00');
  const inited = ref(false);

  const scrollTopOffset = ref(0);
  const scrollStyle = computed(() => {
    const offset = scrollTopOffset.value;
    if (offset > 0) {
      return { height: `calc(100vh - ${offset}px)` };
    }
    return {};
  });

  const sourceOptions = ['全部', '银行', '支付宝', '微信'];
  const flowOptions = ['全部', '收入', '支出'];

  const timeLabel = computed(() => {
    if (!timeRange.value) return '';
    return `${timeRange.value.startTime} ~ ${timeRange.value.endTime}`;
  });

  const loadMoreStatus = computed(() => {
    if (loading.value) return 'loading';
    if (list.value.length >= total.value && total.value > 0) return 'nomore';
    return 'loadmore';
  });

  const groupedByDate = computed(() => {
    const groups: Record<string, BillItem[]> = {};
    list.value.forEach((item) => {
      const date = item.tradeTime?.slice(0, 10) || '未知日期';
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    const sorted: Record<string, BillItem[]> = {};
    Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .forEach((key) => {
        sorted[key] = groups[key];
      });
    return sorted;
  });

  function getSourceLabel(source: string) {
    const map: Record<string, string> = { bank: '银行', aliPay: '支付宝', weChat: '微信' };
    return map[source] || source;
  }

  function getSourceIcon(source: string) {
    const map: Record<string, string> = { bank: 'grid', aliPay: 'grid', weChat: 'weixin-fill' };
    return map[source] || 'list';
  }

  async function loadAllBills() {
    loading.value = true;
    try {
      const promises: Promise<any>[] = [];
      const sourceIdx = currentSource.value;
      const flowVal = currentFlow.value === 0 ? undefined : currentFlow.value;
      const inflowOrOutflow = flowVal === 1 ? 1 : flowVal === 2 ? 2 : undefined;
      const searchParams: any = { current: 1, size: 200 };
      if (keyword.value) searchParams.tradeOtherPerson = keyword.value;
      if (inflowOrOutflow !== undefined) searchParams.inflowOrOutflow = inflowOrOutflow;

      if (sourceIdx === 0 || sourceIdx === 1) {
        promises.push(
          bankApi.getPage(searchParams).then((res) =>
            (res.list || []).map((item: any) => ({
              id: `bank_${item.bankId}`,
              source: 'bank',
              tradeTime: item.tradeTime,
              tradeOtherPerson: item.tradeOtherPerson,
              explain: item.explain,
              moneyAmount: item.moneyAmount,
              inflowOrOutflow: item.inflowOrOutflow,
              balance: item.balance,
              rawItem: item,
            }))
          )
        );
      }
      if (sourceIdx === 0 || sourceIdx === 2) {
        promises.push(
          aliPayApi.getPage(searchParams).then((res) =>
            (res.list || []).map((item: any) => ({
              id: `aliPay_${item.aliPayId}`,
              source: 'aliPay',
              tradeTime: item.tradeTime,
              tradeOtherPerson: item.tradeOtherPerson,
              explain: item.explain,
              moneyAmount: item.moneyAmount,
              inflowOrOutflow: item.inflowOrOutflow,
              balance: item.balance,
              rawItem: item,
            }))
          )
        );
      }
      if (sourceIdx === 0 || sourceIdx === 3) {
        promises.push(
          weChatApi.getPage(searchParams).then((res) =>
            (res.list || []).map((item: any) => ({
              id: `weChat_${item.weChatId}`,
              source: 'weChat',
              tradeTime: item.tradeTime,
              tradeOtherPerson: item.tradeOtherPerson,
              explain: item.explain,
              moneyAmount: item.moneyAmount,
              inflowOrOutflow: item.inflowOrOutflow,
              balance: item.balance,
              rawItem: item,
            }))
          )
        );
      }

      const results = await Promise.all(promises);
      let allBills: BillItem[] = results.flat();

      if (timeRange.value) {
        allBills = allBills.filter((item) => {
          const date = item.tradeTime?.slice(0, 10);
          return date && date >= timeRange.value!.startTime && date <= timeRange.value!.endTime;
        });
      }

      allBills.sort((a, b) => b.tradeTime?.localeCompare(a.tradeTime || '') || 0);
      list.value = allBills;
      total.value = allBills.length;

      const inflow = allBills.filter((b) => b.inflowOrOutflow === 1).reduce((sum, b) => sum + (b.moneyAmount || 0), 0);
      const outflow = allBills.filter((b) => b.inflowOrOutflow === 2).reduce((sum, b) => sum + (b.moneyAmount || 0), 0);
      inflowTotal.value = inflow.toFixed(2);
      outflowTotal.value = outflow.toFixed(2);
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
      isRefreshing.value = false;
    }
  }

  function loadMore() {}
  function onPullDownRefresh() {
    isRefreshing.value = true;
    loadAllBills();
  }
  function onReachBottom() {}
  function handleSearch() {
    loadAllBills();
  }
  function handleClear() {
    keyword.value = '';
    loadAllBills();
  }
  function onSourceChange(index: number) {
    currentSource.value = index;
    loadAllBills();
  }
  function onFlowChange(index: number) {
    currentFlow.value = index;
    loadAllBills();
  }
  function onTimeConfirm(params: { startTime: string; endTime: string }) {
    timeRange.value = params;
    loadAllBills();
  }
  function clearTimeRange() {
    timeRange.value = null;
    loadAllBills();
  }

  function goToDetail(item: BillItem) {
    const sourcePageMap: Record<string, string> = {
      bank: `/pages/finance/bill-detail/bill-detail?source=bank&id=${item.rawItem.bankId}`,
      aliPay: `/pages/finance/bill-detail/bill-detail?source=aliPay&id=${item.rawItem.aliPayId}`,
      weChat: `/pages/finance/bill-detail/bill-detail?source=weChat&id=${item.rawItem.weChatId}`,
    };
    uni.navigateTo({ url: sourcePageMap[item.source] || '' });
  }

  function onFabAction(action: string) {
    showFabMenu.value = false;
    switch (action) {
      case 'upload':
        uni.navigateTo({ url: '/pages/finance/upload/upload' });
        break;
      case 'summary':
        uni.navigateTo({ url: '/pages/finance/summary/summary' });
        break;
    }
  }

  function calcScrollHeight() {
    try {
      const sysInfo = uni.getSystemInfoSync();
      const statusBarHeight = sysInfo.statusBarHeight || 0;
      const navBarHeight = 44;
      const headerHeight = 200;
      const tabBarHeight = 50;
      scrollTopOffset.value = statusBarHeight + navBarHeight + headerHeight + tabBarHeight;
    } catch {
      scrollTopOffset.value = 0;
    }
  }

  onMounted(() => {
    calcScrollHeight();
    loadAllBills();
    inited.value = true;
  });

  watch(
    () => props.active,
    (val) => {
      if (val && inited.value) loadAllBills();
    }
  );
</script>

<style lang="scss" scoped>
  .finance-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: $uni-bg-color-grey;
  }

  .finance-header {
    margin: 20rpx 20rpx 0;
  }
  .finance-summary-row {
    display: flex;
    align-items: center;
  }
  .finance-summary-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .finance-summary-label {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }
  .finance-summary-value {
    font-size: 36rpx;
    font-weight: bold;
    margin-top: 8rpx;
  }
  .finance-summary-divider {
    width: 2rpx;
    height: 60rpx;
    background-color: $uni-border-color;
  }
  .finance-toolbar {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin: 16rpx 20rpx 0;
  }

  .finance-toolbar-actions {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex-shrink: 0;
  }

  .finance-toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8rpx;
  }

  .finance-filter {
    margin: 12rpx 20rpx 0;
    background-color: #ffffff;
    border-radius: 16rpx;
    padding: 20rpx 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  }

  .finance-filter-time-tag {
    display: inline-flex;
    align-items: center;
    gap: 8rpx;
    background-color: #e8f4fd;
    border-radius: 20rpx;
    padding: 8rpx 20rpx;
    margin-bottom: 16rpx;
  }

  .finance-filter-time-text {
    font-size: 24rpx;
    color: #007aff;
  }

  .finance-filter-row {
    margin-bottom: 16rpx;
  }

  .finance-filter-label {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 12rpx;
    display: block;
  }
  .finance-list-scroll {
    flex: 1;
    height: 0;
    margin-top: 16rpx;
  }
  .finance-refresher {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx 0;
    gap: 12rpx;
  }
  .finance-refresher-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }
  .finance-list {
    padding: 0 20rpx;
  }
  .finance-date-header {
    padding: 16rpx 8rpx 8rpx;
  }
  .finance-date-text {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    font-weight: bold;
  }
  .finance-bill-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12rpx;
    padding: 20rpx 24rpx;
  }
  .finance-bill-left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }
  .finance-bill-icon {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .finance-bill-icon-in {
    background: linear-gradient(135deg, #4cd964, #34c759);
  }
  .finance-bill-icon-out {
    background: linear-gradient(135deg, #ff6b6b, #ff3b30);
  }
  .finance-bill-info {
    margin-left: 20rpx;
    flex: 1;
    min-width: 0;
  }
  .finance-bill-title {
    font-size: $uni-font-size-base;
    font-weight: 500;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .finance-bill-sub {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 4rpx;
    display: block;
  }
  .finance-bill-right {
    flex-shrink: 0;
    margin-left: 20rpx;
  }
  .finance-bill-amount {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }
  .finance-loading,
  .finance-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;
  }
  .finance-loading-text {
    margin-top: 20rpx;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-sm;
  }

  .finance-fab-popup {
    padding: 0;

    .finance-fab-popup-header {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      padding: 36rpx 30rpx 24rpx;
      border-bottom: 1rpx solid #f0f0f0;

      .finance-fab-popup-title {
        font-size: 32rpx;
        font-weight: 600;
        color: $uni-text-color;
      }

      .finance-fab-popup-close {
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
      }
    }

    .finance-fab-popup-body {
      padding: 12rpx 0;
      padding-bottom: calc(12rpx + env(safe-area-inset-bottom));

      .finance-fab-action-item {
        display: flex;
        align-items: center;
        padding: 28rpx 30rpx;
        gap: 24rpx;

        &:active {
          background-color: #f8f8f8;
        }

        .finance-fab-action-icon {
          width: 80rpx;
          height: 80rpx;
          border-radius: 20rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .finance-fab-action-content {
          flex: 1;
          min-width: 0;

          .finance-fab-action-label {
            font-size: 30rpx;
            font-weight: 500;
            color: $uni-text-color;
            display: block;
          }

          .finance-fab-action-desc {
            font-size: 24rpx;
            color: $uni-text-color-placeholder;
            margin-top: 6rpx;
            display: block;
          }
        }
      }
    }
  }
</style>
