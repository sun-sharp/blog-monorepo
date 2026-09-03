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
            <u-tag
              v-if="(source === 'aliPay' || source === 'weChat' || source === 'manual') && billMethodLabel !== '--'"
              :text="billMethodLabel"
              type="warning"
              size="mini"
              plain />
          </view>
        </view>

        <view class="bill-detail-info card">
          <view class="info-row">
            <text class="info-label">交易对方</text>
            <text class="info-value">{{ bill.tradeOtherPerson || '--' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">对方备注</text>
            <text class="info-value">{{ bill.tradeOtherPersonRemarks || '--' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">收/支</text>
            <text class="info-value">{{ bill.incomeOrPay || '--' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">交易类型</text>
            <text class="info-value">{{ bill.tradeType || '--' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">说明</text>
            <text class="info-value">{{ bill.explain || '--' }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">使用地点</text>
            <text class="info-value">{{ bill.place || '--' }}</text>
          </view>
          <view v-if="bill.balance !== undefined && bill.balance !== null" class="info-row">
            <text class="info-label">余额</text>
            <text class="info-value">¥{{ formatMoney(bill.balance) }}</text>
          </view>
          <view v-if="bill.otherCost !== undefined && bill.otherCost !== null" class="info-row">
            <text class="info-label">其它费用</text>
            <text class="info-value">¥{{ formatMoney(bill.otherCost) }}</text>
          </view>

          <template v-if="source === 'weChat'">
            <view class="info-row">
              <text class="info-label">商品</text>
              <text class="info-value">{{ bill.goods || '--' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">支付方式</text>
              <text class="info-value">{{ bill.paymentMethod || '--' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">当前状态</text>
              <text class="info-value">{{ bill.currentStatus || '--' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">备注</text>
              <text class="info-value">{{ bill.remarks || '--' }}</text>
            </view>
          </template>

          <template v-if="source === 'aliPay'">
            <view class="info-row">
              <text class="info-label">商品说明</text>
              <text class="info-value">{{ bill.productDescription || '--' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">收/付款方式</text>
              <text class="info-value">{{ bill.paymentMethod || '--' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">对方账号</text>
              <text class="info-value">{{ bill.oppositeAccount || '--' }}</text>
            </view>
            <view v-if="bill.balanceBaby !== undefined && bill.balanceBaby !== null" class="info-row">
              <text class="info-label">余额宝</text>
              <text class="info-value">¥{{ formatMoney(bill.balanceBaby) }}</text>
            </view>
          </template>

          <template v-if="source === 'aliPay' || source === 'weChat' || source === 'manual'">
            <view class="info-row">
              <text class="info-label">账单类型</text>
              <text class="info-value type">{{ billTypeLabel }}</text>
            </view>
          </template>

          <template v-if="source === 'bank'">
            <view class="info-row">
              <text class="info-label">凭证号码</text>
              <text class="info-value">{{ bill.voucherNo || '--' }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">对方账号</text>
              <text class="info-value">{{ bill.tradeOtherPersonAccount || '--' }}</text>
            </view>
            <template v-if="bill.isRetiredBankCard">
              <view class="info-row">
                <text class="info-label">卡片状态</text>
                <text class="info-value error">已报废</text>
              </view>
              <view v-if="bill.replaceCardNo" class="info-row">
                <text class="info-label">新卡号</text>
                <text class="info-value">{{ bill.replaceCardNo }}</text>
              </view>
              <view v-if="bill.bankCardRemark" class="info-row">
                <text class="info-label">说明</text>
                <text class="info-value">{{ bill.bankCardRemark }}</text>
              </view>
            </template>
            <view class="info-row">
              <text class="info-label">银行账单类型</text>
              <text class="info-value type">{{ bankBillTypeLabel }}</text>
            </view>
          </template>
        </view>
      </template>
    </scroll-view>

    <view v-if="bill.tradeTime" class="bill-detail-footer">
      <view v-if="source === 'manual'" class="bill-detail-action-btn" @click="goToCopyAdd">
        <u-icon name="copy" size="30" color="#007aff" custom-prefix="sharp-icon" />
        <text class="bill-detail-action-text">复制新增</text>
      </view>
      <view class="bill-detail-action-btn" @click="goToEdit">
        <u-icon name="edit-pen" size="30" color="#007aff" />
        <text class="bill-detail-action-text">编辑</text>
      </view>
      <view v-if="source === 'manual'" class="bill-detail-action-btn bill-detail-action-btn-danger" @click="onDelete">
        <u-icon name="trash" size="30" color="#dd524d" />
        <text class="bill-detail-action-text bill-detail-action-text-danger">删除</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { aggregateBillApi, manualBillApi } from '../../../api';
  import { consumeRefreshFlag, setRefreshFlag } from '../../../composables/useRefreshFlag';
  import { useApiTypeStore } from '../../../store';
  import { inflowOrOutflowOption } from '../../../../shared/src/constants/api-type';
  import type { ApiAggregateBillDetail } from '/#/api/blog/money/aggregate';

  const apiTypeStore = useApiTypeStore();
  const source = ref('');
  const id = ref('');
  const loading = ref(false);
  const bill = ref<Partial<ApiAggregateBillDetail>>({});

  const sourceLabel = computed(() => {
    const map: Record<string, string> = { bank: '银行', aliPay: '支付宝', weChat: '微信', manual: '人工录入' };
    return map[source.value] || '';
  });

  const billTypeSelectList = computed(() => apiTypeStore.getBillTypeOption as { label: string; value: number | string; [key: string]: string | number }[]);

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

  const bankBillTypeLabel = computed(() => {
    if (source.value !== 'bank') return '--';
    const found = billTypeSelectList.value.find((o) => o.value === bill.value.bankBillType);
    return found ? found.label : '--';
  });

  const billTypeLabel = computed(() => {
    if (!['weChat', 'aliPay', 'manual'].includes(source.value)) return '--';
    const found = billTypeSelectList.value.find((o) => o.value === bill.value.billType);
    return found ? found.label : '--';
  });

  const billMethodLabel = computed(() => {
    const found = apiTypeStore.getBillMethodOption.find((o) => o.value === bill.value.billMethod);
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
    if (source.value === 'manual') {
      uni.navigateTo({ url: `/pages/finance/manual-edit/manual-edit?id=${id.value}` });
      return;
    }
    uni.navigateTo({ url: `/pages/finance/bill-edit/bill-edit?source=${source.value}&id=${id.value}` });
  }

  function goToCopyAdd() {
    if (source.value !== 'manual') return;
    const b = bill.value;
    const qs = [
      `tradeTime=${encodeURIComponent(b.tradeTime || '')}`,
      `tradeOtherPerson=${encodeURIComponent(b.tradeOtherPerson || '')}`,
      `inflowOrOutflow=${b.inflowOrOutflow ?? ''}`,
      `moneyAmount=${b.moneyAmount ?? ''}`,
      `balance=${b.balance ?? ''}`,
      `explain=${encodeURIComponent(b.explain || '')}`,
      `place=${encodeURIComponent(b.place || '')}`,
      `billType=${b.billType ?? ''}`,
      `billMethod=${b.billMethod ?? ''}`,
    ].join('&');
    uni.navigateTo({ url: `/pages/finance/manual-edit/manual-edit?${qs}` });
  }

  function onDelete() {
    if (source.value !== 'manual') return;
    uni.showModal({
      title: '确认删除',
      content: '确定删除该人工录入账单？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await manualBillApi.remove(id.value);
            uni.showToast({ title: '删除成功', icon: 'success' });
            setRefreshFlag('bill');
            setTimeout(() => uni.navigateBack(), 500);
          } catch (e) {
            console.error(e);
          }
        }
      },
    });
  }

  onLoad(async (options) => {
    if (options?.source) source.value = options.source;
    if (options?.id) id.value = options.id;
    Promise.all([apiTypeStore.getBillType(), apiTypeStore.getBillMethod(), apiTypeStore.getBankType()]);
    loadBill();
  });

  onShow(() => {
    if (source.value && id.value && consumeRefreshFlag('bill')) {
      loadBill();
      setRefreshFlag('bill');
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20rpx;
    padding: 20rpx 24rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    background-color: #ffffff;
    border-top: 1rpx solid #e5e5e5;
  }

  .bill-detail-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    padding: 16rpx 28rpx;
    border-radius: 44rpx;
    min-width: 150rpx;
  }

  .bill-detail-action-text {
    font-size: $uni-font-size-base;
    color: #007aff;
  }

  .bill-detail-action-text-danger {
    color: #dd524d;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20rpx 0;
    border-bottom: 1rpx solid $uni-border-color;

    &:last-child {
      border-bottom: none;
    }
  }

  .info-label {
    flex-shrink: 0;
    font-size: $uni-font-size-base;
    color: $uni-text-color-grey;
    margin-right: 24rpx;
  }

  .info-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
    text-align: right;
    word-break: break-all;

    &.type {
      font-weight: bold;
      color: $uni-color-primary;
    }

    &.method {
      font-weight: bold;
      color: $uni-color-error;
    }

    &.error {
      font-weight: bold;
      color: $uni-color-error;
    }
  }
</style>
