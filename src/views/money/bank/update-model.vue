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
        {{ voucherTypeMap[modelForm.voucherType] || '' }}
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

<script lang="ts">
  import { inflowOrOutflowOption, voucherTypeMap } from '@/constant';
  import { defineComponent, nextTick, reactive, ref } from 'vue';
  import { bankApi } from '@/api';
  import { useApiType } from '@/hooks';

  const modelFields = {
    tradeTime: '',
    tradeType: '',
    bankType: null,
    voucherType: null,
    voucherNo: '',
    tradeOtherPerson: '',
    tradeOtherPersonAccount: '',
    tradeOtherPersonRemarks: '',
    incomeOrPay: '',
    moneyAmount: 0,
    balance: 0,
    otherCost: 0,
    explain: '',
    place: '',
    inflowOrOutflow: null,
    bankBillType: null,
  };

  export default defineComponent({
    components: {},
    emits: ['refurbish'],
    setup(_props, { emit }) {
      const modelId = ref('');
      const showModal = ref(false);

      const formBtnLoading = ref(false);
      const modelFromRef = ref();
      const modelForm = reactive<any>(Object.assign({}, modelFields));
      const modelRules = reactive({
        inflowOrOutflow: {
          type: 'number',
          required: true,
          trigger: 'change',
          message: `请选择流入/流出`,
        },
        bankBillType: {
          type: 'number',
          required: true,
          trigger: 'change',
          message: `请选择银行账单类型`,
        },
      });

      // 角色列表
      const roleOption = ref([]);

      // 获取账单类型
      const { getBillTypeOption } = useApiType();

      // 初始化
      const init = (row: any) => {
        showModal.value = true;
        modelId.value = row?.bankId;
        resetFields();
        if (modelId.value) {
          Object.assign(modelForm, row);
        }
      };
      // 重置
      const resetFields = () => {
        Object.assign(modelForm, modelFields);
        nextTick(() => {
          modelFromRef.value.restoreValidation();
        });
      };

      // 提交
      const confirmForm = (e) => {
        e.preventDefault();
        formBtnLoading.value = true;
        modelFromRef.value.validate((errors) => {
          if (!errors && modelId.value) {
            bankApi
              .update({
                bankId: modelId.value,
                otherCost: modelForm.otherCost,
                tradeOtherPersonRemarks: modelForm.tradeOtherPersonRemarks,
                inflowOrOutflow: modelForm.inflowOrOutflow,
                explain: modelForm.explain,
                place: modelForm.place,
                bankBillType: modelForm.bankBillType,
              })
              .then(() => {
                showModal.value = false;
                emit('refurbish');
              });
          }
          formBtnLoading.value = false;
        });
      };

      return {
        modelId,
        showModal,
        modelFromRef,
        modelForm,
        modelRules,
        formBtnLoading,
        roleOption,
        voucherTypeMap,
        inflowOrOutflowOption,
        billTypeOption: getBillTypeOption,
        init,
        confirmForm,
      };
    },
  });
</script>

<style lang="scss">
  .we-chat-update-model {
    &__body {
      padding-right: 20px;
      max-height: 60vh;
      overflow-y: auto;
    }
  }
</style>
