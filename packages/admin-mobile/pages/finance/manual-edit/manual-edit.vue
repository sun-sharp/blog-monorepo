<template>
  <view class="manual-edit-page">
    <scroll-view scroll-y class="manual-edit-scroll">
      <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <view class="manual-edit-card card">
          <text class="manual-edit-section-title">基本信息</text>
          <u-form-item label="交易时间" prop="tradeTime" required>
            <view class="manual-edit-select" @click="showTradeTimePicker = true">
              <text :class="form.tradeTime ? 'manual-edit-select-value' : 'manual-edit-select-placeholder'">{{ form.tradeTime || '请选择' }}</text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
          <u-form-item label="交易对方" prop="tradeOtherPerson" required>
            <u-input v-model="form.tradeOtherPerson" placeholder="请输入交易对方" :cursor-spacing="20" />
          </u-form-item>
          <u-form-item label="流入/流出" prop="inflowOrOutflow" required>
            <view class="manual-edit-select" @click="showInflowSelect = true">
              <text :class="form.inflowOrOutflow ? 'manual-edit-select-value' : 'manual-edit-select-placeholder'">
                {{ inflowLabel || '请选择' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
          <u-form-item label="交易金额" prop="moneyAmount" required>
            <u-input v-model="moneyAmountInput" type="digit" placeholder="请输入交易金额" :cursor-spacing="20" />
          </u-form-item>
          <u-form-item label="余额" prop="balance" required>
            <u-input v-model="balanceInput" type="digit" placeholder="请输入余额" :cursor-spacing="20" />
          </u-form-item>
          <u-form-item label="说明" prop="explain">
            <u-input v-model="form.explain" placeholder="请输入说明" :cursor-spacing="20" />
          </u-form-item>
          <u-form-item label="交易场所" prop="place">
            <u-input v-model="form.place" placeholder="请输入交易场所" :cursor-spacing="20" />
          </u-form-item>
        </view>

        <view class="manual-edit-card card">
          <text class="manual-edit-section-title">分类信息</text>
          <u-form-item label="账单类型" prop="billType" required>
            <view class="manual-edit-select" @click="showBillTypeSelect = true">
              <text :class="form.billType ? 'manual-edit-select-value' : 'manual-edit-select-placeholder'">
                {{ billTypeLabel || '请选择' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
          <u-form-item label="账单方式" prop="billMethod" required>
            <view class="manual-edit-select" @click="showBillMethodSelect = true">
              <text :class="form.billMethod ? 'manual-edit-select-value' : 'manual-edit-select-placeholder'">
                {{ billMethodLabel || '请选择' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
        </view>
      </u-form>
    </scroll-view>

    <u-picker v-model="showTradeTimePicker" mode="time" :params="timePickerParams" :default-time="form.tradeTime || today" @confirm="onTradeTimeConfirm" />
    <searchable-select
      v-model="showInflowSelect"
      title="选择流入/流出"
      :list="inflowOrOutflowList"
      :current-value="form.inflowOrOutflow || undefined"
      @confirm="(item: any) => (form.inflowOrOutflow = Number(item.value))" />
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
  import { onLoad } from '@dcloudio/uni-app';
  import { setRefreshFlag } from '../../../composables/useRefreshFlag';
  import { manualBillApi } from '../../../api';
  import { inflowOrOutflowOption } from '../../../../shared/src/constants/api-type';
  import { useApiTypeStore } from '../../../store';
  import SearchableSelect from '../../../components/searchable-select/searchable-select.vue';
  import { roundToTwoArrow } from '../../../../shared/src/utils/number.js';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');
  const showTradeTimePicker = ref(false);
  const showInflowSelect = ref(false);
  const showBillTypeSelect = ref(false);
  const showBillMethodSelect = ref(false);
  const apiTypeStore = useApiTypeStore();

  const timePickerParams = { year: true, month: true, day: true, hour: true, minute: true, second: true };

  const form = reactive({
    tradeTime: '',
    tradeOtherPerson: '',
    inflowOrOutflow: null as number | null,
    moneyAmount: 0,
    balance: 0,
    explain: '',
    place: '',
    billType: null as number | null,
    billMethod: null as number | null,
  });

  const moneyAmountInput = computed({
    get: () => {
      const val = form.moneyAmount;
      if (val) {
        return roundToTwoArrow(Number(val));
      } else {
        return 0;
      }
    },
    set: (val: string) => (form.moneyAmount = val ? roundToTwoArrow(val) : 0),
  });
  const balanceInput = computed({
    get: () => {
      const val = form.balance;
      if (val) {
        return roundToTwoArrow(Number(val));
      } else {
        return 0;
      }
    },
    set: (val: string) => (form.balance = val ? roundToTwoArrow(val) : 0),
  });

  const inflowOrOutflowList = inflowOrOutflowOption.map((item) => ({ label: item.label, value: item.value }));
  const billTypeSelectList = computed(() => apiTypeStore.getBillTypeOption as { label: string; value: number | string; [key: string]: string | number }[]);
  const billMethodSelectList = computed(() => apiTypeStore.getBillMethodOption as { label: string; value: number | string; [key: string]: string | number }[]);

  const inflowLabel = computed(() => inflowOrOutflowList.find((r) => r.value === form.inflowOrOutflow)?.label || '');
  const billTypeLabel = computed(() => billTypeSelectList.value.find((r) => r.value === form.billType)?.label || '');
  const billMethodLabel = computed(() => billMethodSelectList.value.find((r) => r.value === form.billMethod)?.label || '');

  const today = computed(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}:${s}`;
  });

  const rules = {
    tradeTime: [{ required: true, message: '请选择交易时间', trigger: 'change' }],
    tradeOtherPerson: [{ required: true, message: '请输入交易对方', trigger: 'change' }],
    inflowOrOutflow: [{ required: true, type: 'number', message: '请选择流入/流出', trigger: 'change' }],
    moneyAmount: [{ required: true, type: 'number', message: '请输入交易金额', trigger: ['change', 'blur'] }],
    balance: [{ required: true, type: 'number', message: '请输入余额', trigger: ['change', 'blur'] }],
    billType: [{ required: true, type: 'number', message: '请选择账单类型', trigger: 'change' }],
    billMethod: [{ required: true, type: 'number', message: '请选择账单方式', trigger: 'change' }],
  };

  function onTradeTimeConfirm(e: any) {
    let timeStr = `${e.year}-${String(e.month).padStart(2, '0')}-${String(e.day).padStart(2, '0')}`;
    if (e.hour !== undefined) {
      timeStr += ` ${String(e.hour).padStart(2, '0')}:${String(e.minute).padStart(2, '0')}`;
      if (e.second !== undefined) timeStr += `:${String(e.second).padStart(2, '0')}`;
    }
    form.tradeTime = timeStr;
    showTradeTimePicker.value = false;
  }

  async function handleSave() {
    let valid = true;
    try {
      valid = (await formRef.value?.validate()) ?? true;
    } catch {
      valid = false;
    }
    if (!valid) return;
    loading.value = true;
    try {
      const data: any = {
        tradeTime: form.tradeTime,
        tradeOtherPerson: form.tradeOtherPerson,
        inflowOrOutflow: form.inflowOrOutflow,
        moneyAmount: form.moneyAmount,
        balance: form.balance,
        explain: form.explain,
        place: form.place,
        billType: form.billType,
        billMethod: form.billMethod,
      };
      if (editId.value) {
        await manualBillApi.update({ ...data, manualBillId: editId.value });
      } else {
        await manualBillApi.save(data);
      }
      uni.showToast({ title: '保存成功', icon: 'success' });
      setRefreshFlag('bill');
      setTimeout(() => uni.navigateBack(), 500);
    } finally {
      loading.value = false;
    }
  }

  async function loadDetail(id: string) {
    try {
      const res = await manualBillApi.getOne(id);
      if (res) {
        form.tradeTime = res.tradeTime || '';
        form.tradeOtherPerson = res.tradeOtherPerson || '';
        form.inflowOrOutflow = res.inflowOrOutflow ?? null;
        form.moneyAmount = res.moneyAmount ?? 0;
        form.balance = res.balance ?? 0;
        form.explain = res.explain || '';
        form.place = res.place || '';
        form.billType = res.billType ?? null;
        form.billMethod = res.billMethod ?? null;
      }
    } catch (e) {
      console.error(e);
    }
  }

  onMounted(() => {
    Promise.all([apiTypeStore.getBillType(), apiTypeStore.getBillMethod()]);
  });

  function parseNum(val: string | undefined): number | null {
    if (val === undefined || val === '') return null;
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
  }

  onLoad((options) => {
    if (options?.id) {
      editId.value = options.id;
      uni.setNavigationBarTitle({ title: '编辑账单' });
      loadDetail(options.id);
    } else {
      uni.setNavigationBarTitle({ title: '录入账单' });
      // 从详情「复制新增」进入：预填字段
      if (options) {
        if (options.tradeTime) form.tradeTime = decodeURIComponent(options.tradeTime);
        if (options.tradeOtherPerson) form.tradeOtherPerson = decodeURIComponent(options.tradeOtherPerson);
        const inflow = parseNum(options.inflowOrOutflow);
        if (inflow !== null) form.inflowOrOutflow = inflow;
        const money = parseNum(options.moneyAmount);
        if (money !== null) form.moneyAmount = money;
        const balance = parseNum(options.balance);
        if (balance !== null) form.balance = balance;
        if (options.explain) form.explain = decodeURIComponent(options.explain);
        if (options.place) form.place = decodeURIComponent(options.place);
        const billType = parseNum(options.billType);
        if (billType !== null) form.billType = billType;
        const billMethod = parseNum(options.billMethod);
        if (billMethod !== null) form.billMethod = billMethod;
      }
    }
  });
</script>

<style lang="scss" scoped>
  .manual-edit-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .manual-edit-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx 20rpx;
    padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
    box-sizing: border-box;
  }

  .manual-edit-card {
    padding: 24rpx;
    margin-bottom: 16rpx;
  }

  .manual-edit-section-title {
    font-size: $uni-font-size-lg;
    font-weight: 600;
    color: $uni-text-color;
    display: block;
    margin-bottom: 20rpx;
  }

  .manual-edit-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72rpx;
    padding: 0 24rpx;
    background-color: #f5f5f5;
    border-radius: 12rpx;
  }

  .manual-edit-select-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
  }

  .manual-edit-select-placeholder {
    font-size: $uni-font-size-base;
    color: $uni-text-color-placeholder;
  }
</style>
