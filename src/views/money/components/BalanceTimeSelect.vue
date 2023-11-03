<script lang="ts" setup>
  import { lastHalfYearFormatRange } from '@/utils';
  import { ref } from 'vue';
  import { BalanceDateRangeType } from '/#/views/money';

  const emit = defineEmits(['balanceChange']);

  const modelTitle = '时间范围选择';
  const showModal = ref(false);

  const balanceDateRange = ref<BalanceDateRangeType>(lastHalfYearFormatRange('yyyy-MM-dd'));

  const formBtnLoading = ref(false);

  // 初始化
  const init = () => {
    showModal.value = true;
    resetFields();
  };

  // 重置
  const resetFields = () => {
    balanceDateRange.value = lastHalfYearFormatRange('yyyy-MM-dd');
  };

  // 提交
  const confirmForm = (e: MouseEvent) => {
    e.preventDefault();
    emit('balanceChange', balanceDateRange.value);
    showModal.value = false;
  };

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="balance-time-select w-600" :show-icon="false" :mask-closable="false" preset="dialog" :title="modelTitle">
    <n-date-picker v-model:formatted-value="balanceDateRange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" clearable />
    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" :disabled="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style lang="scss">
  .balance-time-select {
    display: block;
  }
</style>
