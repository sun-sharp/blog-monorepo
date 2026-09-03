<script lang="ts" setup>
  import { useManualBillAddUpdateModel } from '../hooks/useManualBillAddUpdateModel';
  import { inflowOrOutflowOption } from '@/constant';

  const emit = defineEmits(['refresh']);

  const { showModal, modelTitle, modelFromRef, modelForm, modelRules, formBtnLoading, billTypeOption, billMethodOption, init, confirmForm } =
    useManualBillAddUpdateModel(emit);

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" :mask-closable="false" preset="dialog" :title="modelTitle">
    <n-form ref="modelFromRef" class="manual-bill-add-update__body" :model="modelForm" :rules="modelRules" label-placement="top" :label-width="120">
      <n-form-item label="交易时间" path="tradeTime">
        <n-date-picker v-model:value="modelForm.tradeTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" clearable placeholder="请选择交易时间" />
      </n-form-item>
      <n-form-item label="交易对方" path="tradeOtherPerson">
        <n-input v-model:value="modelForm.tradeOtherPerson" placeholder="请输入交易对方" />
      </n-form-item>
      <n-form-item label="流入/流出" path="inflowOrOutflow">
        <n-select v-model:value="modelForm.inflowOrOutflow" :options="inflowOrOutflowOption" clearable placeholder="请选择流入/流出" />
      </n-form-item>
      <n-form-item label="交易金额" path="moneyAmount">
        <n-input-number v-model:value="modelForm.moneyAmount" :min="0" :precision="2" placeholder="请输入交易金额" style="width: 100%" />
      </n-form-item>
      <n-form-item label="余额" path="balance">
        <n-input-number v-model:value="modelForm.balance" :min="0" :precision="2" placeholder="请输入余额" style="width: 100%" />
      </n-form-item>
      <n-form-item label="说明" path="explain">
        <n-input v-model:value="modelForm.explain" placeholder="请输入说明" />
      </n-form-item>
      <n-form-item label="交易场所" path="place">
        <n-input v-model:value="modelForm.place" placeholder="请输入交易场所" />
      </n-form-item>
      <n-form-item label="账单类型" path="billType">
        <n-select v-model:value="modelForm.billType" :options="billTypeOption" filterable clearable placeholder="请选择账单类型" />
      </n-form-item>
      <n-form-item label="账单方式" path="billMethod">
        <n-select v-model:value="modelForm.billMethod" :options="billMethodOption" filterable clearable placeholder="请选择账单方式" />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" :disabled="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style lang="scss" scoped>
  .manual-bill-add-update {
    &__body {
      max-height: 60vh;
      padding-right: 20px;
      overflow-y: auto;
    }
  }
</style>
