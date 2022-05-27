<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" :mask-closable="false" preset="dialog" :title="modelId ? '修改微信账单' : ''">
    <n-form ref="modelFromRef" class="we-chat-update-model__body" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="交易时间">
        {{ modelForm.tradeTime }}
      </n-form-item>
      <n-form-item label="交易类型">
        {{ modelForm.tradeType }}
      </n-form-item>
      <n-form-item label="交易对方">
        {{ modelForm.tradeOtherPerson }}
      </n-form-item>
      <n-form-item label="交易对方备注" path="tradeOtherPersonRemarks">
        <n-input v-model:value="modelForm.tradeOtherPersonRemarks" placeholder="请输入交易对方备注" />
      </n-form-item>
      <n-form-item label="商品">
        {{ modelForm.goods }}
      </n-form-item>
      <n-form-item label="收/支">
        {{ modelForm.incomeOrPay }}
      </n-form-item>
      <n-form-item label="金额(元)">￥{{ modelForm.moneyAmount }}</n-form-item>
      <n-form-item label="支付方式">
        {{ modelForm.paymentMethod }}
      </n-form-item>
      <n-form-item label="当前状态">
        {{ modelForm.currentStatus }}
      </n-form-item>
      <n-form-item label="备注">
        {{ modelForm.remarks }}
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
      <n-form-item label="账单类型" path="billType">
        <n-select v-model:value="modelForm.billType" filterable :options="billTypeOption" placeholder="请选择账单类型" />
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
  import { billTypeOption, inflowOrOutflowOption } from '@/constant';
  import { defineComponent, nextTick, reactive, ref } from 'vue';
  import { weChatApi } from '@/api';

  const modelFields = {
    tradeTime: '',
    tradeType: '',
    tradeOtherPerson: '',
    tradeOtherPersonRemarks: '',
    goods: '',
    incomeOrPay: '',
    moneyAmount: '',
    paymentMethod: '',
    currentStatus: '',
    remarks: '',
    explain: '',
    place: '',
    inflowOrOutflow: null,
    billType: null,
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
        billType: {
          type: 'number',
          required: true,
          trigger: 'change',
          message: `请选择账单类型`,
        },
      });

      // 角色列表
      const roleOption = ref([]);

      // 初始化
      const init = (row: any) => {
        showModal.value = true;
        modelId.value = row?.weChatId;
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
            weChatApi
              .update({
                weChatId: modelId.value,
                tradeOtherPersonRemarks: modelForm.tradeOtherPersonRemarks,
                inflowOrOutflow: modelForm.inflowOrOutflow,
                explain: modelForm.explain,
                place: modelForm.place,
                billType: modelForm.billType,
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
        inflowOrOutflowOption,
        billTypeOption,
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
