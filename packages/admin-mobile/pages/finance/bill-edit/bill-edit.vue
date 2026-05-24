<template>
  <view class="bill-edit-page">
    <scroll-view scroll-y class="bill-edit-scroll">
      <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <u-form-item label="交易对方备注" prop="tradeOtherPersonRemarks">
          <u-input v-model="form.tradeOtherPersonRemarks" placeholder="请输入交易对方备注" />
        </u-form-item>
        <u-form-item label="流入/流出" prop="inflowOrOutflow">
          <view class="bill-edit-select" @click="showInflowSelect = true">
            <text class="bill-edit-select-value">{{ inflowLabel || '请选择' }}</text>
            <u-icon name="arrow-right" size="28" color="#999" />
          </view>
        </u-form-item>
        <u-form-item label="说明" prop="explain">
          <u-input v-model="form.explain" placeholder="请输入说明" />
        </u-form-item>
        <u-form-item label="交易场所" prop="place">
          <u-input v-model="form.place" placeholder="请输入交易场所" />
        </u-form-item>
      </u-form>
    </scroll-view>

    <u-select v-model="showInflowSelect" :list="inflowOrOutflowList" title="选择流入/流出" @confirm="onInflowConfirm" />

    <view class="fixed-bottom-btn">
      <u-button type="primary" :loading="loading" @click="handleSave">保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { bankApi, weChatApi, aliPayApi } from '../../../api';
  import { inflowOrOutflowOption } from '../../../../shared/src/constants/api-type';

  const formRef = ref();
  const loading = ref(false);
  const source = ref('');
  const editId = ref('');
  const showInflowSelect = ref(false);

  const inflowOrOutflowList = inflowOrOutflowOption.map((item) => ({ label: item.label, value: item.value }));

  const form = reactive({
    tradeOtherPersonRemarks: '',
    inflowOrOutflow: 0 as number,
    explain: '',
    place: '',
    otherCost: 0,
    bankBillType: 0,
    billMethod: 0,
    billType: 0,
  });

  const inflowLabel = computed(() => {
    const item = inflowOrOutflowList.find((r) => r.value === form.inflowOrOutflow);
    return item?.label || '';
  });

  const rules = {
    inflowOrOutflow: [{ required: true, message: '请选择流入/流出', trigger: 'change' }],
  };

  function onInflowConfirm(e: any) {
    form.inflowOrOutflow = e[0]?.value ?? 0;
  }

  async function handleSave() {
    try {
      await formRef.value?.validate();
    } catch {
      return;
    }
    loading.value = true;
    try {
      if (source.value === 'bank') {
        await bankApi.update({ ...form, bankId: editId.value });
      } else if (source.value === 'weChat') {
        await weChatApi.update({ ...form, weChatId: editId.value });
      } else if (source.value === 'aliPay') {
        await aliPayApi.update({ ...form, aliPayId: editId.value });
      }
      uni.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => uni.navigateBack(), 500);
    } finally {
      loading.value = false;
    }
  }

  onLoad((options) => {
    if (options?.source) source.value = options.source;
    if (options?.id) {
      editId.value = options.id;
      uni.setNavigationBarTitle({ title: '编辑账单' });
    }
  });
</script>

<style lang="scss" scoped>
  .bill-edit-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: $uni-bg-color-grey;
  }

  .bill-edit-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
  }

  .bill-edit-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70rpx;
    padding: 0 20rpx;
    background-color: #f5f5f5;
    border-radius: 8rpx;
  }

  .bill-edit-select-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
  }
</style>
