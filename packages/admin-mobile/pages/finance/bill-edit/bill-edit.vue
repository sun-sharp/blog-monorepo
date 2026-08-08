<template>
  <view class="bill-edit-page">
    <scroll-view scroll-y class="bill-edit-scroll">
      <view v-if="detail.tradeTime" class="bill-edit-card card">
        <text class="bill-edit-section-title">账单信息</text>
        <view class="bill-edit-readonly">
          <view class="bill-edit-readonly-item">
            <text class="bill-edit-readonly-label">交易时间</text>
            <text class="bill-edit-readonly-value">{{ detail.tradeTime }}</text>
          </view>
          <view class="bill-edit-readonly-item">
            <text class="bill-edit-readonly-label">交易对方</text>
            <text class="bill-edit-readonly-value">{{ detail.tradeOtherPerson || '--' }}</text>
          </view>
          <view class="bill-edit-readonly-item">
            <text class="bill-edit-readonly-label">收/支</text>
            <text class="bill-edit-readonly-value">{{ detail.incomeOrPay || '--' }}</text>
          </view>
          <view class="bill-edit-readonly-item">
            <text class="bill-edit-readonly-label">交易金额</text>
            <text :class="detail.inflowOrOutflow === 1 ? 'money-inflow' : 'money-outflow'" class="bill-edit-readonly-value">
              {{ detail.inflowOrOutflow === 1 ? '+' : '-' }}¥{{ formatMoney(detail.moneyAmount) }}
            </text>
          </view>
          <view class="bill-edit-readonly-item">
            <text class="bill-edit-readonly-label">交易类型</text>
            <text class="bill-edit-readonly-value">{{ detail.tradeType || '--' }}</text>
          </view>
          <template v-if="source === 'weChat'">
            <view class="bill-edit-readonly-item">
              <text class="bill-edit-readonly-label">商品</text>
              <text class="bill-edit-readonly-value">{{ detail.goods || '--' }}</text>
            </view>
            <view class="bill-edit-readonly-item">
              <text class="bill-edit-readonly-label">支付方式</text>
              <text class="bill-edit-readonly-value">{{ detail.paymentMethod || '--' }}</text>
            </view>
            <view class="bill-edit-readonly-item">
              <text class="bill-edit-readonly-label">当前状态</text>
              <text class="bill-edit-readonly-value">{{ detail.currentStatus || '--' }}</text>
            </view>
          </template>
          <template v-if="source === 'aliPay'">
            <view class="bill-edit-readonly-item">
              <text class="bill-edit-readonly-label">商品说明</text>
              <text class="bill-edit-readonly-value">{{ detail.productDescription || '--' }}</text>
            </view>
            <view class="bill-edit-readonly-item">
              <text class="bill-edit-readonly-label">收/付款方式</text>
              <text class="bill-edit-readonly-value">{{ detail.paymentMethod || '--' }}</text>
            </view>
            <view class="bill-edit-readonly-item">
              <text class="bill-edit-readonly-label">对方账号</text>
              <text class="bill-edit-readonly-value">{{ detail.oppositeAccount || '--' }}</text>
            </view>
          </template>
          <template v-if="source === 'bank'">
            <view class="bill-edit-readonly-item">
              <text class="bill-edit-readonly-label">银行类型</text>
              <text class="bill-edit-readonly-value">{{ bankTypeLabel }}</text>
            </view>
            <view class="bill-edit-readonly-item">
              <text class="bill-edit-readonly-label">凭证号码</text>
              <text class="bill-edit-readonly-value">{{ detail.voucherNo || '--' }}</text>
            </view>
            <view class="bill-edit-readonly-item">
              <text class="bill-edit-readonly-label">对方账号</text>
              <text class="bill-edit-readonly-value">{{ detail.tradeOtherPersonAccount || '--' }}</text>
            </view>
          </template>
          <view v-if="detail.balance !== undefined && detail.balance !== null" class="bill-edit-readonly-item">
            <text class="bill-edit-readonly-label">余额</text>
            <text class="bill-edit-readonly-value">¥{{ formatMoney(detail.balance) }}</text>
          </view>
        </view>
      </view>

      <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <view class="bill-edit-card card">
          <text class="bill-edit-section-title">基本信息</text>
          <u-form-item label="交易对方备注" prop="tradeOtherPersonRemarks">
            <u-input v-model="form.tradeOtherPersonRemarks" placeholder="请输入交易对方备注" :cursor-spacing="20" />
          </u-form-item>
          <u-form-item label="流入/流出" prop="inflowOrOutflow">
            <view class="bill-edit-select" @click="showInflowSelect = true">
              <text :class="form.inflowOrOutflow ? 'bill-edit-select-value' : 'bill-edit-select-placeholder'">
                {{ inflowLabel || '请选择' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
          <u-form-item label="说明" prop="explain">
            <u-input v-model="form.explain" placeholder="请输入说明" :cursor-spacing="20" />
          </u-form-item>
          <u-form-item label="交易场所" prop="place">
            <u-input v-model="form.place" placeholder="请输入交易场所" :cursor-spacing="20" />
          </u-form-item>
        </view>

        <view v-if="source === 'bank'" class="bill-edit-card card">
          <text class="bill-edit-section-title">银行信息</text>
          <u-form-item label="其它费用" prop="otherCost">
            <u-number-box v-model="form.otherCost" :min="0" :step="0.01" />
          </u-form-item>
          <u-form-item label="银行账单类型" prop="bankBillType">
            <view class="bill-edit-select" @click="showBankBillTypeSelect = true">
              <text :class="form.bankBillType ? 'bill-edit-select-value' : 'bill-edit-select-placeholder'">
                {{ bankBillTypeLabel || '请选择' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
        </view>

        <view v-if="source === 'aliPay' || source === 'weChat'" class="bill-edit-card card">
          <text class="bill-edit-section-title">{{ source === 'aliPay' ? '支付宝' : '微信' }}信息</text>
          <u-form-item label="账单类型" prop="billType">
            <view class="bill-edit-select" @click="showBillTypeSelect = true">
              <text :class="form.billType ? 'bill-edit-select-value' : 'bill-edit-select-placeholder'">
                {{ billTypeLabel || '请选择' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
          <u-form-item label="账单方式" prop="billMethod">
            <view class="bill-edit-select" @click="showBillMethodSelect = true">
              <text :class="form.billMethod ? 'bill-edit-select-value' : 'bill-edit-select-placeholder'">
                {{ billMethodLabel || '请选择' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
        </view>
      </u-form>
    </scroll-view>

    <searchable-select
      v-model="showInflowSelect"
      title="选择流入/流出"
      :list="inflowOrOutflowList"
      :current-value="form.inflowOrOutflow || undefined"
      @confirm="(item: any) => (form.inflowOrOutflow = Number(item.value))" />
    <searchable-select
      v-model="showBankBillTypeSelect"
      title="选择银行账单类型"
      :list="billTypeSelectList"
      :current-value="form.bankBillType || undefined"
      @confirm="(item: any) => (form.bankBillType = Number(item.value))" />
    <searchable-select
      v-model="showBillTypeSelect"
      title="选择账单类型"
      :list="billTypeSelectList"
      :current-value="form.billType || undefined"
      @confirm="(item: any) => (form.billType = Number(item.value))" />
    <searchable-select
      v-model="showBillMethodSelect"
      title="选择账单方式"
      :list="billMethodSelectList"
      :current-value="form.billMethod || undefined"
      @confirm="(item: any) => (form.billMethod = Number(item.value))" />

    <view class="fixed-bottom-btn">
      <u-button type="primary" shape="circle" :loading="loading" @click="handleSave">保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { setRefreshFlag } from '../../../composables/useRefreshFlag';
  import { onLoad } from '@dcloudio/uni-app';
  import { aggregateBillApi } from '../../../api';
  import { inflowOrOutflowOption } from '../../../../shared/src/constants/api-type';
  import { useApiTypeStore } from '../../../store';
  import type { ApiAggregateBillDetail } from '/#/api/blog/money/aggregate';
  import SearchableSelect from '../../../components/searchable-select/searchable-select.vue';

  const formRef = ref();
  const loading = ref(false);
  const source = ref('');
  const editId = ref('');
  const showInflowSelect = ref(false);
  const showBankBillTypeSelect = ref(false);
  const showBillTypeSelect = ref(false);
  const showBillMethodSelect = ref(false);
  const apiTypeStore = useApiTypeStore();
  const detail = ref<Partial<ApiAggregateBillDetail>>({});

  const inflowOrOutflowList = inflowOrOutflowOption.map((item) => ({ label: item.label, value: item.value }));
  const billTypeSelectList = computed(() => apiTypeStore.getBillTypeOption as { label: string; value: number | string; [key: string]: string | number }[]);
  const billMethodSelectList = computed(() => apiTypeStore.getBillMethodOption as { label: string; value: number | string; [key: string]: string | number }[]);

  const form = reactive({
    tradeOtherPersonRemarks: '',
    inflowOrOutflow: null as number | null,
    explain: '',
    place: '',
    otherCost: 0,
    bankBillType: null as number | null,
    billType: null as number | null,
    billMethod: null as number | null,
  });

  const inflowLabel = computed(() => inflowOrOutflowList.find((r) => r.value === form.inflowOrOutflow)?.label || '');
  const bankBillTypeLabel = computed(() => billTypeSelectList.value.find((r) => r.value === form.bankBillType)?.label || '');
  const billTypeLabel = computed(() => billTypeSelectList.value.find((r) => r.value === form.billType)?.label || '');
  const billMethodLabel = computed(() => billMethodSelectList.value.find((r) => r.value === form.billMethod)?.label || '');

  const bankTypeLabel = computed(() => {
    if (source.value !== 'bank') return '--';
    const bankType = detail.value.bankType;
    const found = apiTypeStore.getBankTypeOption.find((o) => o.value === bankType);
    return found ? found.label : '--';
  });

  function formatMoney(val: number | undefined | null): string {
    if (val === undefined || val === null) return '0.00';
    return Number(val).toFixed(2);
  }

  const rules = {
    inflowOrOutflow: [{ required: true, message: '请选择流入/流出', trigger: 'change' }],
  };

  async function loadDetail() {
    if (!source.value || !editId.value) return;
    try {
      const res = await aggregateBillApi.findAggregateOne(source.value, editId.value);
      detail.value = res || {};
      form.tradeOtherPersonRemarks = res.tradeOtherPersonRemarks || '';
      form.inflowOrOutflow = res.inflowOrOutflow || null;
      form.explain = res.explain || '';
      form.place = res.place || '';
      form.otherCost = res.otherCost ?? 0;
      form.bankBillType = res.bankBillType ?? null;
      form.billType = res.billType ?? null;
      form.billMethod = res.billMethod ?? null;
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSave() {
    try {
      await formRef.value?.validate();
    } catch {
      return;
    }
    loading.value = true;
    try {
      const data: any = {
        source: source.value,
        billId: editId.value,
        tradeOtherPersonRemarks: form.tradeOtherPersonRemarks,
        inflowOrOutflow: form.inflowOrOutflow,
        explain: form.explain,
        place: form.place,
      };
      if (source.value === 'bank') {
        data.otherCost = form.otherCost;
        data.bankBillType = form.bankBillType;
      } else {
        data.billType = form.billType;
        data.billMethod = form.billMethod;
      }
      await aggregateBillApi.updateAggregate(data);
      uni.showToast({ title: '保存成功', icon: 'success' });
      setRefreshFlag('bill');
      setTimeout(() => uni.navigateBack(), 500);
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    Promise.all([apiTypeStore.getBillType(), apiTypeStore.getBillMethod(), apiTypeStore.getBankType()]);
  });

  onLoad((options) => {
    if (options?.source) source.value = options.source;
    if (options?.id) {
      editId.value = options.id;
      uni.setNavigationBarTitle({ title: '编辑账单' });
      loadDetail();
    }
  });
</script>

<style lang="scss" scoped>
  .bill-edit-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .bill-edit-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx 20rpx;
    padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
    box-sizing: border-box;
  }

  .bill-edit-card {
    padding: 24rpx;
    margin-bottom: 16rpx;
  }

  .bill-edit-section-title {
    font-size: $uni-font-size-lg;
    font-weight: 600;
    color: $uni-text-color;
    display: block;
    margin-bottom: 20rpx;
  }

  .bill-edit-readonly {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }

  .bill-edit-readonly-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .bill-edit-readonly-label {
    font-size: $uni-font-size-base;
    color: $uni-text-color-grey;
    flex-shrink: 0;
  }

  .bill-edit-readonly-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
    text-align: right;
    flex: 1;
    margin-left: 20rpx;
    word-break: break-all;
  }

  .bill-edit-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72rpx;
    padding: 0 24rpx;
    background-color: #f5f5f5;
    border-radius: 12rpx;
  }

  .bill-edit-select-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
  }

  .bill-edit-select-placeholder {
    font-size: $uni-font-size-base;
    color: $uni-text-color-placeholder;
  }
</style>
