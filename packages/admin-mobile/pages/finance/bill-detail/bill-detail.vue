<template>
  <view class="bill-detail-page">
    <scroll-view scroll-y class="bill-detail-scroll">
      <view v-if="loading && !bill.tradeTime" class="bill-detail-loading">
        <u-loading mode="circle" size="60" />
        <text class="bill-detail-loading-text">加载中...</text>
      </view>

      <template v-if="bill.tradeTime">
        <view class="bill-detail-header card">
          <view class="bill-detail-amount-row">
            <text :class="bill.inflowOrOutflow === 1 ? 'money-inflow' : 'money-outflow'" class="bill-detail-amount">
              {{ bill.inflowOrOutflow === 1 ? '+' : '-' }}¥{{ formatMoney(bill.moneyAmount) }}
            </text>
            <u-tag :text="sourceLabel" type="primary" size="mini" plain />
          </view>
          <text class="bill-detail-time">{{ bill.tradeTime || '' }}</text>
          <view class="bill-detail-tags">
            <u-tag v-if="inflowLabel" :text="inflowLabel" :type="bill.inflowOrOutflow === 1 ? 'success' : 'error'" size="mini" />
            <u-tag v-if="source === 'bank' && bankTypeLabel !== '--'" :text="bankTypeLabel" type="warning" size="mini" plain />
          </view>
        </view>

        <view class="bill-detail-info card">
          <u-cell-group>
            <u-cell-item title="交易对方" :value="bill.tradeOtherPerson || '--'" />
            <u-cell-item title="对方备注" :value="bill.tradeOtherPersonRemarks || '--'" />
            <u-cell-item title="收/支" :value="bill.incomeOrPay || '--'" />
            <u-cell-item title="交易类型" :value="bill.tradeType || '--'" />
            <u-cell-item title="说明" :value="bill.explain || '--'" />
            <u-cell-item title="使用地点" :value="bill.place || '--'" />
            <u-cell-item v-if="bill.balance !== undefined && bill.balance !== null" title="余额" :value="`¥${formatMoney(bill.balance)}`" />
            <u-cell-item v-if="bill.otherCost !== undefined && bill.otherCost !== null" title="其它费用" :value="`¥${formatMoney(bill.otherCost)}`" />

            <template v-if="source === 'weChat'">
              <u-cell-item title="商品" :value="bill.goods || '--'" />
              <u-cell-item title="支付方式" :value="bill.paymentMethod || '--'" />
              <u-cell-item title="当前状态" :value="bill.currentStatus || '--'" />
              <u-cell-item title="备注" :value="bill.remarks || '--'" />
            </template>

            <template v-if="source === 'aliPay'">
              <u-cell-item title="商品说明" :value="bill.productDescription || '--'" />
              <u-cell-item title="收/付款方式" :value="bill.paymentMethod || '--'" />
              <u-cell-item title="对方账号" :value="bill.oppositeAccount || '--'" />
              <u-cell-item v-if="bill.balanceBaby !== undefined && bill.balanceBaby !== null" title="余额宝" :value="`¥${formatMoney(bill.balanceBaby)}`" />
            </template>

            <template v-if="source === 'bank'">
              <u-cell-item title="银行类型" :value="bankTypeLabel" />
              <u-cell-item title="凭证号码" :value="bill.voucherNo || '--'" />
              <u-cell-item title="对方账号" :value="bill.tradeOtherPersonAccount || '--'" />
            </template>
          </u-cell-group>
        </view>
      </template>
    </scroll-view>

    <view v-if="bill.tradeTime" class="bill-detail-footer">
      <u-button type="primary" shape="circle" icon="edit-pen" @click="goToEdit">编辑</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { aggregateBillApi } from '../../../api';
  import { useApiTypeStore } from '../../../store';
  import { inflowOrOutflowOption } from '../../../../shared/src/constants/api-type';
  import type { ApiAggregateBillDetail } from '/#/api/blog/money/aggregate';

  const apiTypeStore = useApiTypeStore();
  const source = ref('');
  const id = ref('');
  const loading = ref(false);
  const bill = ref<Partial<ApiAggregateBillDetail>>({});

  const sourceLabel = computed(() => {
    const map: Record<string, string> = { bank: '银行', aliPay: '支付宝', weChat: '微信' };
    return map[source.value] || '';
  });

  const inflowLabel = computed(() => {
    if (!bill.value.inflowOrOutflow) return '';
    const found = inflowOrOutflowOption.find((o) => o.value === bill.value.inflowOrOutflow);
    return found?.label || '';
  });

  const bankTypeLabel = computed(() => {
    if (source.value !== 'bank') return '--';
    const bankType = bill.value.bankType;
    const found = apiTypeStore.getBankTypeOption.find((o) => o.value === bankType);
    return found ? found.label : '--';
  });

  function formatMoney(val: number | undefined | null): string {
    if (val === undefined || val === null) return '0.00';
    return Number(val).toFixed(2);
  }

  async function loadBill() {
    if (!source.value || !id.value) return;
    loading.value = true;
    try {
      const res = await aggregateBillApi.findAggregateOne(source.value, id.value);
      bill.value = res || {};
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  function goToEdit() {
    uni.navigateTo({ url: `/pages/finance/bill-edit/bill-edit?source=${source.value}&id=${id.value}` });
  }

  onLoad(async (options) => {
    if (options?.source) source.value = options.source;
    if (options?.id) id.value = options.id;
    await apiTypeStore.getBankType();
    loadBill();
  });

  onShow(() => {
    if (source.value && id.value) {
      loadBill();
    }
  });
</script>

<style lang="scss" scoped>
  .bill-detail-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .bill-detail-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
    box-sizing: border-box;
  }

  .bill-detail-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;
  }

  .bill-detail-loading-text {
    margin-top: 20rpx;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-sm;
  }

  .bill-detail-header {
    text-align: center;
    padding: 40rpx 24rpx;
  }

  .bill-detail-amount-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
  }

  .bill-detail-amount {
    font-size: 52rpx;
    font-weight: bold;
  }

  .bill-detail-time {
    display: block;
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
    margin-top: 12rpx;
  }

  .bill-detail-tags {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    margin-top: 16rpx;
  }

  .bill-detail-footer {
    flex-shrink: 0;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    background-color: $uni-bg-color;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  }
</style>
