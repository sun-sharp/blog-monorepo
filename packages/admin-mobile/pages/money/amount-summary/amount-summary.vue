<template>
  <view class="amount-summary-page">
    <view class="summary-section card">
      <view class="section-header">
        <text class="section-title">余额概览</text>
      </view>
      <u-cell-group v-if="balanceList.length > 0">
        <u-cell-item v-for="item in balanceList" :key="item.name" :title="item.name">
          <template #value>
            <text class="money-inflow">¥{{ item.value }}</text>
          </template>
        </u-cell-item>
      </u-cell-group>
      <u-empty v-else mode="data" text="暂无数据" icon-size="100" />
    </view>

    <view class="summary-section card">
      <view class="section-header flex-between">
        <text class="section-title">银行流水</text>
        <u-button size="mini" type="primary" plain @click="showBankTimeSelect = true">选择时间</u-button>
      </view>
      <u-cell-group v-if="bankFlowList.length > 0">
        <u-cell-item v-for="item in bankFlowList" :key="item.name" :title="item.name" :label="`起: ¥${item.startBalance} / 终: ¥${item.endBalance}`">
          <template #value>
            <view class="flow-values">
              <text class="money-inflow">+¥{{ item.inflowMoneyAmount }}</text>
              <text class="money-outflow">-¥{{ item.outflowMoneyAmount }}</text>
            </view>
          </template>
        </u-cell-item>
      </u-cell-group>
      <u-empty v-else mode="data" text="暂无数据" icon-size="100" />
    </view>

    <view class="summary-section card">
      <view class="section-header flex-between">
        <text class="section-title">收支统计</text>
        <u-button size="mini" type="primary" plain @click="showFlowTimeSelect = true">选择时间</u-button>
      </view>
      <template v-if="flowData">
        <view class="flow-summary">
          <view class="flow-summary-item">
            <text class="flow-summary-label">流入总计</text>
            <text class="money-inflow flow-summary-value">¥{{ flowData.inflowSumTotal }}</text>
          </view>
          <view class="flow-summary-item">
            <text class="flow-summary-label">流出总计</text>
            <text class="money-outflow flow-summary-value">¥{{ flowData.outflowSumTotal }}</text>
          </view>
        </view>
        <u-cell-group v-if="flowData.inflowChart.length > 0">
          <u-cell-item v-for="item in flowData.inflowChart" :key="'in-' + item.name" :title="item.name">
            <template #value>
              <text class="money-inflow">+¥{{ item.money }}</text>
            </template>
          </u-cell-item>
        </u-cell-group>
        <u-cell-group v-if="flowData.outflowChart.length > 0">
          <u-cell-item v-for="item in flowData.outflowChart" :key="'out-' + item.name" :title="item.name">
            <template #value>
              <text class="money-outflow">-¥{{ item.money }}</text>
            </template>
          </u-cell-item>
        </u-cell-group>
      </template>
      <u-empty v-else mode="data" text="暂无数据" icon-size="100" />
    </view>

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
  .amount-summary-page {
    padding: 20rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  }

  .summary-section {
    margin-bottom: 20rpx;
  }

  .section-header {
    margin-bottom: 16rpx;
  }

  .section-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .flow-values {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4rpx;
  }

  .flow-summary {
    display: flex;
    justify-content: space-around;
    padding: 20rpx 0;
    margin-bottom: 10rpx;
    background-color: $uni-bg-color-grey;
    border-radius: $uni-border-radius-base;
  }

  .flow-summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .flow-summary-label {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }

  .flow-summary-value {
    font-size: $uni-font-size-lg;
    font-weight: bold;
    margin-top: 8rpx;
  }
</style>
