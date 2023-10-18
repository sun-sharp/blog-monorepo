<script lang="ts" setup>
  import { inflowOrOutflowOption, voucherTypeMap } from '@/constant';
  import { useBankUpdateModel } from '../hooks/useBankUpdateModel';

  const emit = defineEmits(['refresh']);

  const { showModal, modelId, modelForm, modelRules, formBtnLoading, billTypeOption, init, confirmForm } = useBankUpdateModel(emit);

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" :mask-closable="false" preset="dialog" :title="modelId ? '修改银行账单' : ''">
    <n-form ref="modelFromRef" class="we-chat-update-model__body" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="交易时间">
        {{ modelForm.tradeTime }}
      </n-form-item>
      <n-form-item label="交易类型">
        {{ modelForm.tradeType }}
      </n-form-item>
      <n-form-item label="凭证类型">
        {{ modelForm.voucherType ? voucherTypeMap[modelForm.voucherType] : '' }}
      </n-form-item>
      <n-form-item label="凭证号码">
        {{ modelForm.voucherNo }}
      </n-form-item>
      <n-form-item label="交易对方">
        {{ modelForm.tradeOtherPerson }}
      </n-form-item>
      <n-form-item label="交易对方账号">
        {{ modelForm.tradeOtherPersonAccount }}
      </n-form-item>
      <n-form-item label="交易对方备注" path="tradeOtherPersonRemarks">
        <n-input v-model:value="modelForm.tradeOtherPersonRemarks" placeholder="请输入交易对方备注" />
      </n-form-item>
      <n-form-item label="收/支">
        {{ modelForm.incomeOrPay }}
      </n-form-item>
      <n-form-item label="交易金额">￥{{ modelForm.moneyAmount }}</n-form-item>
      <n-form-item label="余额">￥{{ modelForm.balance }}</n-form-item>
      <n-form-item label="其它费用">
        <n-input-number v-model:value="modelForm.otherCost">
          <template #prefix>￥</template>
        </n-input-number>
      </n-form-item>
      <n-form-item label="流入/流出" path="inflowOrOutflow">
        <n-radio-group v-model:value="modelForm.inflowOrOutflow" name="radiogroup">
          <n-space>
            <n-radio v-for="item in inflowOrOutflowOption" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="账单说明" path="explain">
        <n-input v-model:value="modelForm.explain" type="textarea" :rows="2" placeholder="请输入账单说明" />
      </n-form-item>
      <n-form-item label="使用地点" path="place">
        <n-input v-model:value="modelForm.place" type="textarea" :rows="2" placeholder="请输入使用地点" />
      </n-form-item>
      <n-form-item label="银行账单类型" path="bankBillType">
        <n-select v-model:value="modelForm.bankBillType" filterable :options="billTypeOption" placeholder="请选择银行账单类型" />
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

<style lang="scss">
  .we-chat-update-model {
    &__body {
      max-height: 60vh;
      padding-right: 20px;
      overflow-y: auto;
    }
  }
</style>
