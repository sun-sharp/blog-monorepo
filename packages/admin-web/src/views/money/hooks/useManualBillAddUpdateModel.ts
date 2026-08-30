import { computed, nextTick, reactive, ref, unref } from 'vue';
import { manualBillApi } from '@/api';
import { useApiType } from '@/hooks';
import { ApiManualBillItem, ApiManualBillSaveData } from '/#/api/blog/money/manual-bill';
import { FormItemRule } from 'naive-ui';

interface ManualBillForm {
  tradeTime: string | null;
  tradeOtherPerson: string | null;
  inflowOrOutflow: number | null;
  moneyAmount: number | null;
  manualPaymentMethod: number | null;
  balance: number | null;
  explain: string | null;
  place: string | null;
  billType: number | null;
  billMethod: number | null;
}

const modelFields: ManualBillForm = {
  tradeTime: null,
  tradeOtherPerson: '',
  inflowOrOutflow: null,
  moneyAmount: null,
  manualPaymentMethod: null,
  balance: null,
  explain: '',
  place: '',
  billType: null,
  billMethod: null,
};

const modelRules = {
  tradeTime: {
    required: true,
    trigger: ['blur', 'change'],
    message: `请选择交易时间`,
  },
  tradeOtherPerson: {
    required: true,
    trigger: ['blur', 'change'],
    message: `请输入交易对方`,
  },
  inflowOrOutflow: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: `请选择流入/流出`,
  },
  moneyAmount: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: `请输入交易金额`,
  },
  manualPaymentMethod: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: `请选择支付方式`,
  },
  balance: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: `请输入余额`,
  },
  billType: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: `请选择账单类型`,
  },
  billMethod: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: `请选择账单方式`,
  },
};

// 新增、编辑手写账单 弹窗
export const useManualBillAddUpdateModel = (emit: (event: 'refresh', ...args: any[]) => void) => {
  // 弹窗
  const modelId = ref('');
  const showModal = ref(false);
  const modelTitle = computed(() => (unref(modelId) ? '修改' : '新增') + '人工录入账单');

  const formBtnLoading = ref(false);
  const modelFromRef = ref();
  const modelForm = reactive<ManualBillForm>(Object.assign({}, modelFields));

  // 获取账单类型
  const { getBillTypeOption, getBillMethodOption } = useApiType();

  // 初始化
  const init = (row: ApiManualBillItem) => {
    showModal.value = true;
    modelId.value = row?.manualBillId;
    resetFields();
    if (modelId.value) {
      modelForm.tradeTime = row.tradeTime || null;
      modelForm.tradeOtherPerson = row.tradeOtherPerson || '';
      modelForm.inflowOrOutflow = row.inflowOrOutflow ?? null;
      modelForm.moneyAmount = row.moneyAmount ?? null;
      modelForm.manualPaymentMethod = row.manualPaymentMethod ?? null;
      modelForm.balance = row.balance ?? null;
      modelForm.explain = row.explain || '';
      modelForm.place = row.place || '';
      modelForm.billType = row.billType ?? null;
      modelForm.billMethod = row.billMethod ?? null;
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
  const confirmForm = (e: MouseEvent) => {
    e.preventDefault();
    formBtnLoading.value = true;
    modelFromRef.value.validate((errors: FormItemRule) => {
      if (!errors) {
        const params: ApiManualBillSaveData = {
          tradeTime: modelForm.tradeTime || '',
          tradeOtherPerson: modelForm.tradeOtherPerson || '',
          inflowOrOutflow: modelForm.inflowOrOutflow || 0,
          moneyAmount: modelForm.moneyAmount || 0,
          manualPaymentMethod: modelForm.manualPaymentMethod || 0,
          balance: modelForm.balance || 0,
          explain: modelForm.explain || '',
          place: modelForm.place || '',
          billType: modelForm.billType || 0,
          billMethod: modelForm.billMethod || 0,
        };
        const request = modelId.value ? manualBillApi.update({ manualBillId: modelId.value, ...params }) : manualBillApi.save(params);
        request.then(() => {
          showModal.value = false;
          emit('refresh');
        });
      }
      formBtnLoading.value = false;
    });
  };

  return {
    modelTitle,
    showModal,
    modelFromRef,
    modelForm,
    modelRules,
    formBtnLoading,
    billTypeOption: getBillTypeOption,
    billMethodOption: getBillMethodOption,
    init,
    confirmForm,
  };
};
