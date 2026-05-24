<template>
  <view class="summary-page">
    <scroll-view scroll-y class="summary-scroll">
      <view class="summary-section card">
        <view class="section-header">
          <u-icon name="red-packet" size="36" color="#007aff" />
          <text class="section-title">余额概览</text>
        </view>
        <view v-if="balanceList.length > 0" class="summary-balance-grid">
          <view v-for="item in balanceList" :key="item.name" class="summary-balance-item">
            <text class="summary-balance-label">{{ item.name }}</text>
            <text class="summary-balance-value money-inflow">¥{{ item.value }}</text>
          </view>
        </view>
        <u-empty v-else mode="data" text="暂无数据" icon-size="100" />
      </view>

      <view class="summary-section card">
        <view class="section-header flex-between">
          <view class="flex-row">
            <u-icon name="list" size="36" color="#f0ad4e" />
            <text class="section-title">银行流水</text>
          </view>
          <u-button size="mini" type="primary" plain @click="showBankTimeSelect = true">选择时间</u-button>
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

      <view class="summary-section card">
        <view class="section-header flex-between">
          <view class="flex-row">
            <u-icon name="grid" size="36" color="#dd524d" />
            <text class="section-title">收支统计</text>
          </view>
          <u-button size="mini" type="primary" plain @click="showFlowTimeSelect = true">选择时间</u-button>
        </view>
        <template v-if="flowData">
          <view class="summary-flow-summary">
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
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { moneyApi } from '../../../api';
  import type { ApiMoneyBalanceResult, ApiBankFlowResult, ApiInflowOrOutflowMoneyResult } from '/#/api/blog/money';
  import type { ApiStartEndTimeParams } from '/#/api/common';
  import MoneyTimeSelect from '../../../components/money-time-select/money-time-select.vue';

  const balanceList = ref<ApiMoneyBalanceResult[]>([]);
  const bankFlowList = ref<ApiBankFlowResult[]>([]);
  const flowData = ref<ApiInflowOrOutflowMoneyResult | null>(null);
  const showBankTimeSelect = ref(false);
  const showFlowTimeSelect = ref(false);

  function getBarWidth(value: number, total: number): string {
    if (!total) return '0%';
    return Math.min((value / total) * 100, 100) + '%';
  }

  async function loadBalance() {
    try {
      balanceList.value = await moneyApi.statisticsMoneyBalance();
    } catch {
      balanceList.value = [];
    }
  }

  async function loadBankFlow(params: ApiStartEndTimeParams) {
    try {
      bankFlowList.value = await moneyApi.getStatisticsBankFlow(params);
    } catch {
      bankFlowList.value = [];
    }
  }

  async function loadFlowData(params: ApiStartEndTimeParams) {
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
    height: 100%;
    background-color: $uni-bg-color-grey;
  }

  .summary-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
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
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }

  .summary-balance-item {
    width: calc(50% - 8rpx);
    background-color: $uni-bg-color-grey;
    border-radius: $uni-border-radius-base;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
  }

  .summary-balance-label {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .summary-balance-value {
    font-size: 32rpx;
    font-weight: bold;
    margin-top: 8rpx;
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
