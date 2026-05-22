<template>
  <view class="bill-detail-page">
    <view class="bill-detail-header card">
      <view class="bill-detail-amount-row">
        <text :class="bill.inflowOrOutflow === 1 ? 'money-inflow' : 'money-outflow'" class="bill-detail-amount">
          {{ bill.inflowOrOutflow === 1 ? '+' : '-' }}¥{{ bill.moneyAmount || '0.00' }}
        </text>
        <u-tag :text="sourceLabel" type="primary" size="mini" plain />
      </view>
      <text class="bill-detail-time">{{ bill.tradeTime || '' }}</text>
    </view>

    <view class="bill-detail-info card">
      <u-cell-group>
        <u-cell-item title="交易对方" :value="bill.tradeOtherPerson || '--'" />
        <u-cell-item title="对方备注" :value="bill.tradeOtherPersonRemarks || '--'" />
        <u-cell-item title="收/支" :value="bill.incomeOrPay || '--'" />
        <u-cell-item title="交易类型" :value="bill.tradeType || '--'" />
        <u-cell-item title="说明" :value="bill.explain || '--'" />
        <u-cell-item title="使用地点" :value="bill.place || '--'" />
        <u-cell-item v-if="bill.balance !== undefined" title="余额" :value="`¥${bill.balance}`" />
        <u-cell-item v-if="bill.otherCost !== undefined" title="其它费用" :value="`¥${bill.otherCost}`" />
        <u-cell-item v-if="source === 'weChat'" title="商品" :value="(bill as any).goods || '--'" />
        <u-cell-item v-if="source === 'weChat'" title="支付方式" :value="(bill as any).paymentMethod || '--'" />
        <u-cell-item v-if="source === 'weChat'" title="当前状态" :value="(bill as any).currentStatus || '--'" />
        <u-cell-item v-if="source === 'aliPay'" title="商品说明" :value="(bill as any).productDescription || '--'" />
        <u-cell-item v-if="source === 'aliPay'" title="收/付款方式" :value="(bill as any).paymentMethod || '--'" />
        <u-cell-item v-if="source === 'bank'" title="银行类型" :value="bankTypeLabel" />
        <u-cell-item v-if="source === 'bank'" title="凭证号码" :value="(bill as any).voucherNo || '--'" />
      </u-cell-group>
    </view>

    <view class="bill-detail-actions">
      <u-button type="primary" plain icon="edit-pen" @click="goToEdit">编辑</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { bankApi, weChatApi, aliPayApi } from '../../../api';
  import { useApiTypeStore } from '../../../store';

  const apiTypeStore = useApiTypeStore();
  const source = ref('');
  const id = ref('');
  const bill = ref<any>({});

  const sourceLabel = computed(() => {
    const map: Record<string, string> = { bank: '银行', aliPay: '支付宝', weChat: '微信' };
    return map[source.value] || '';
  });

  const bankTypeLabel = computed(() => {
    if (source.value !== 'bank') return '--';
    const bankType = (bill.value as any).bankType;
    const found = apiTypeStore.getBankTypeOption.find((o) => o.value === bankType);
    return found ? found.label : '--';
  });

  async function loadBill() {
    try {
      let res: any;
      if (source.value === 'bank') {
        res = await bankApi.getPage({ current: 1, size: 1 } as any);
        bill.value = (res.list || []).find((a: any) => a.bankId === id.value) || {};
      } else if (source.value === 'aliPay') {
        res = await aliPayApi.getPage({ current: 1, size: 1 } as any);
        bill.value = (res.list || []).find((a: any) => a.aliPayId === id.value) || {};
      } else if (source.value === 'weChat') {
        res = await weChatApi.getPage({ current: 1, size: 1 } as any);
        bill.value = (res.list || []).find((a: any) => a.weChatId === id.value) || {};
      }
    } catch (e) {
      console.error(e);
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
</script>

<style lang="scss" scoped>
  .bill-detail-page {
    padding: 20rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
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

  .bill-detail-actions {
    margin-top: 30rpx;
    padding: 0 10rpx;
  }
</style>
