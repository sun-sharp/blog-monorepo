<template>
  <u-config-provider :dark-mode="mode">
    <view class="summary-page" :class="{ dark: isDark }">
      <scroll-view scroll-y class="summary-scroll">
        <view class="summary-section card" :class="{ dark: isDark }">
          <view class="section-header">
            <u-icon name="red-packet" size="36" color="#007aff" />
            <text class="section-title">余额概览</text>
          </view>
          <view v-if="balanceList.length > 0" class="summary-balance-grid">
            <view v-for="item in balanceList" :key="item.name" class="summary-balance-item">
              <view class="summary-balance-row">
                <text class="summary-balance-label">{{ item.name }}</text>
                <text class="summary-balance-time">{{ item.time }}</text>
              </view>
              <text class="summary-balance-value">¥{{ item.value }}</text>
              <template v-if="item.voucher && item.voucher.length > 1">
                <view v-for="vou in item.voucher" :key="vou.type" class="summary-voucher">
                  <view class="summary-voucher-row">
                    <text class="summary-voucher-label">尾号(****{{ vou.type }})</text>
                    <text class="summary-voucher-time">{{ vou.time }}</text>
                  </view>
                  <text class="summary-voucher-value">¥{{ vou.value }}</text>
                </view>
              </template>
            </view>
          </view>
          <u-empty v-else mode="data" text="暂无数据" icon-size="100" />
        </view>

        <view class="summary-section card" :class="{ dark: isDark }">
          <view class="section-header flex-between">
            <view class="flex-row">
              <u-icon name="list" size="36" color="#f0ad4e" />
              <text class="section-title">银行流水</text>
            </view>
            <u-button size="mini" type="primary" plain @click="showBankTimeSelect = true">选择时间</u-button>
          </view>
          <view v-if="bankTimeLabel" class="summary-filter">
            <view v-if="bankTimeLabel" class="summary-filter-time-tag">
              <u-icon name="calendar" size="24" color="#007aff" />
              <text class="summary-filter-time-text">{{ bankTimeLabel }}</text>
              <!-- <u-icon name="close" size="24" color="#999" /> -->
            </view>
          </view>
          <view v-if="bankFlowList.length > 0" class="summary-flow-list">
            <view v-for="item in bankFlowList" :key="item.name" class="summary-flow-item">
              <view class="summary-flow-header">
                <text class="summary-flow-name">{{ item.name }}</text>
              </view>
              <view class="summary-flow-detail">
                <text class="summary-flow-label">起: ¥{{ item.startBalance }}</text>
                <text class="summary-flow-label">终: ¥{{ item.endBalance }}</text>
              </view>
              <view class="summary-flow-money">
                <text class="money-inflow">+¥{{ item.inflowMoneyAmount }}</text>
                <text class="money-outflow">-¥{{ item.outflowMoneyAmount }}</text>
              </view>
            </view>
          </view>
          <u-empty v-else mode="data" text="暂无数据" icon-size="100" />
        </view>

        <view class="summary-section card" :class="{ dark: isDark }">
          <view class="section-header flex-between">
            <view class="flex-row">
              <u-icon name="grid" size="36" color="#dd524d" />
              <text class="section-title">收支统计</text>
            </view>
            <u-button size="mini" type="primary" plain @click="showFlowTimeSelect = true">选择时间</u-button>
          </view>
          <view v-if="flowTimeLabel" class="summary-filter">
            <view v-if="flowTimeLabel" class="summary-filter-time-tag">
              <u-icon name="calendar" size="24" color="#007aff" />
              <text class="summary-filter-time-text">{{ flowTimeLabel }}</text>
              <!-- <u-icon name="close" size="24" color="#999" /> -->
            </view>
          </view>
          <template v-if="flowData">
            <view class="summary-flow-summary" :class="{ dark: isDark }">
              <view class="summary-flow-summary-item">
                <text class="summary-flow-summary-label">流入总计</text>
                <text class="money-inflow summary-flow-summary-value">¥{{ flowData.inflowSumTotal }}</text>
              </view>
              <view class="summary-flow-summary-item">
                <text class="summary-flow-summary-label">流出总计</text>
                <text class="money-outflow summary-flow-summary-value">¥{{ flowData.outflowSumTotal }}</text>
              </view>
            </view>
            <view v-if="flowData.inflowChart.length > 0" class="summary-chart-section">
              <text class="summary-chart-title">流入分布</text>
              <view v-for="item in flowData.inflowChart" :key="'in-' + item.name" class="summary-chart-item">
                <text class="summary-chart-name">{{ item.name }}</text>
                <view class="summary-chart-bar-wrap">
                  <view class="summary-chart-bar summary-chart-bar-in" :style="{ width: getBarWidth(item.money, flowData.inflowSumTotal) }" />
                </view>
                <text class="money-inflow summary-chart-val">+¥{{ item.money }}</text>
              </view>
            </view>
            <view v-if="flowData.outflowChart.length > 0" class="summary-chart-section">
              <text class="summary-chart-title">流出分布</text>
              <view v-for="item in flowData.outflowChart" :key="'out-' + item.name" class="summary-chart-item">
                <text class="summary-chart-name">{{ item.name }}</text>
                <view class="summary-chart-bar-wrap">
                  <view class="summary-chart-bar summary-chart-bar-out" :style="{ width: getBarWidth(item.money, flowData.outflowSumTotal) }" />
                </view>
                <text class="money-outflow summary-chart-val">-¥{{ item.money }}</text>
              </view>
            </view>
          </template>
          <u-empty v-else mode="data" text="暂无数据" icon-size="100" />
        </view>
      </scroll-view>

      <money-time-select v-model:show="showBankTimeSelect" @confirm="onBankTimeConfirm" />
      <money-time-select v-model:show="showFlowTimeSelect" @confirm="onFlowTimeConfirm" />
    </view>
  </u-config-provider>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import { moneyApi } from '../../../api';
  import type { ApiMoneyBalanceResult, ApiBankFlowResult, ApiInflowOrOutflowMoneyResult } from '/#/api/blog/money';
  import type { ApiStartEndTimeParams } from '/#/api/common';
  import MoneyTimeSelect from '../../../components/money-time-select/money-time-select.vue';
  import { useAppTheme } from '../../../composables/useAppTheme';

  const { isDark, mode } = useAppTheme();

  const balanceList = ref<ApiMoneyBalanceResult[]>([]);
  const bankFlowList = ref<ApiBankFlowResult[]>([]);
  const flowData = ref<ApiInflowOrOutflowMoneyResult | null>(null);
  const showBankTimeSelect = ref(false);
  const showFlowTimeSelect = ref(false);

  const bankTimeRange = ref<{ startTime: string; endTime: string } | null>(null);

  const bankTimeLabel = computed(() => {
    if (!bankTimeRange.value) return '';
    return `${bankTimeRange.value.startTime} ~ ${bankTimeRange.value.endTime}`;
  });

  const flowTimeRange = ref<{ startTime: string; endTime: string } | null>(null);

  const flowTimeLabel = computed(() => {
    if (!flowTimeRange.value) return '';
    return `${flowTimeRange.value.startTime} ~ ${flowTimeRange.value.endTime}`;
  });

  function getBarWidth(value: number, total: number): string {
    if (!total) return '0%';
    return Math.min((value / total) * 100, 100) + '%';
  }

  async function loadBalance() {
    try {
      // balanceList.value = await moneyApi.statisticsMoneyBalance();
      const list = await moneyApi.statisticsMoneyBalance();
      balanceList.value = list
        .filter((f) => f.value > 0)
        .map((m) => {
          if (!m.voucher) {
            return m;
          }
          return {
            ...m,
            voucher: m.voucher.filter((f) => f.value > 0),
          };
        });
    } catch {
      balanceList.value = [];
    }
  }

  async function loadBankFlow(params: ApiStartEndTimeParams) {
    bankTimeRange.value = params;
    try {
      bankFlowList.value = await moneyApi.getStatisticsBankFlow(params);
    } catch {
      bankFlowList.value = [];
    }
  }

  async function loadFlowData(params: ApiStartEndTimeParams) {
    flowTimeRange.value = params;
    try {
      flowData.value = await moneyApi.statisticsInflowOrOutflowMoney(params);
    } catch {
      flowData.value = null;
    }
  }

  function getDefaultTimeRange(): ApiStartEndTimeParams {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 30 * 24 * 60 * 60 * 1000);
    const format = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${dd}`;
    };
    return { startTime: format(start), endTime: format(end) };
  }

  async function onBankTimeConfirm(params: ApiStartEndTimeParams) {
    await loadBankFlow(params);
  }

  async function onFlowTimeConfirm(params: ApiStartEndTimeParams) {
    await loadFlowData(params);
  }

  // function clearBankTimeRange() {
  //   const defaultRange = getDefaultTimeRange();
  //   bankTimeRange.value = defaultRange;
  //   loadBankFlow(defaultRange);
  // }

  // function clearFlowTimeRange() {
  //   const defaultRange = getDefaultTimeRange();
  //   flowTimeRange.value = defaultRange;
  //   loadFlowData(defaultRange);
  // }

  onMounted(async () => {
    await loadBalance();
    const defaultRange = getDefaultTimeRange();
    await loadBankFlow(defaultRange);
    await loadFlowData(defaultRange);
  });
</script>

<style lang="scss" scoped>
  .summary-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;

    &.dark {
      background-color: $uni-bg-color-dark;

      .summary-voucher-item,
      .summary-balance-item,
      .summary-flow-item {
        background-color: $uni-bg-color-dark;
      }
    }
  }

  .summary-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    box-sizing: border-box;
  }

  .summary-section {
    margin-bottom: 20rpx;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 20rpx;
  }

  .section-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .summary-balance-grid {
    // display: flex;
    // flex-wrap: wrap;
    gap: 16rpx;
  }

  .summary-voucher {
    padding: 12rpx 0 0 0;
  }

  .summary-voucher-item,
  .summary-balance-item {
    // width: calc(50% - 8rpx);
    background-color: $uni-bg-color-grey;
    border-radius: $uni-border-radius-base;
    padding: 20rpx;
    margin: 8rpx 0;
    display: flex;
    flex-direction: column;
  }

  .summary-voucher-row,
  .summary-balance-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .summary-voucher-label,
  .summary-balance-label {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .summary-balance-label {
    font-size: $uni-font-size-base;
    font-weight: bold;
  }

  .summary-voucher-time,
  .summary-balance-time {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .summary-balance-time {
    font-size: $uni-font-size-base;
    font-weight: bold;
  }

  .summary-voucher-value,
  .summary-balance-value {
    font-size: 32rpx;
    font-weight: bold;
    margin-top: 8rpx;
    color: #4cd964;
  }

  .summary-voucher-value {
    font-size: 28rpx;
    color: #2e92c0;
  }

  .summary-filter {
    margin: 12rpx 0;
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex-wrap: wrap;
  }

  .summary-filter-time-tag {
    display: inline-flex;
    align-items: center;
    gap: 8rpx;
    background-color: #e8f4fd;
    border-radius: 20rpx;
    padding: 8rpx 20rpx;
  }

  .summary-filter-time-text {
    font-size: 24rpx;
    color: #007aff;
  }

  .summary-flow-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .summary-flow-item {
    background-color: $uni-bg-color-grey;
    border-radius: $uni-border-radius-base;
    padding: 20rpx;
  }

  .summary-flow-name {
    font-weight: bold;
  }

  .summary-flow-detail {
    display: flex;
    gap: 30rpx;
    margin-top: 8rpx;
  }

  .summary-flow-label {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .summary-flow-money {
    display: flex;
    gap: 30rpx;
    margin-top: 8rpx;
    font-size: $uni-font-size-sm;
  }

  .summary-flow-summary {
    display: flex;
    justify-content: space-around;
    padding: 24rpx 0;
    margin-bottom: 20rpx;
    background: linear-gradient(135deg, #f0f7ff, #fff0f0);
    border-radius: $uni-border-radius-lg;

    &.dark {
      background: linear-gradient(135deg, #2c2d2e, #2c2929);
    }
  }

  .summary-flow-summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .summary-flow-summary-label {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .summary-flow-summary-value {
    font-size: 36rpx;
    font-weight: bold;
    margin-top: 8rpx;
  }

  .summary-chart-section {
    margin-bottom: 20rpx;
  }

  .summary-chart-title {
    font-size: $uni-font-size-base;
    font-weight: bold;
    margin-bottom: 12rpx;
    display: block;
  }

  .summary-chart-item {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
    gap: 12rpx;
  }

  .summary-chart-name {
    font-size: $uni-font-size-sm;
    width: 120rpx;
    flex-shrink: 0;
  }

  .summary-chart-bar-wrap {
    flex: 1;
    height: 20rpx;
    background-color: $uni-bg-color-grey;
    border-radius: 10rpx;
    overflow: hidden;
  }

  .summary-chart-bar {
    height: 100%;
    border-radius: 10rpx;
    transition: width 0.3s ease;
  }

  .summary-chart-bar-in {
    background: linear-gradient(90deg, #4cd964, #34c759);
  }

  .summary-chart-bar-out {
    background: linear-gradient(90deg, #ff6b6b, #ff3b30);
  }

  .summary-chart-val {
    font-size: $uni-font-size-sm;
    width: 140rpx;
    text-align: right;
    flex-shrink: 0;
  }
</style>
