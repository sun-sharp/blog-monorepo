import { computed, nextTick, reactive, ref, unref } from 'vue';
import { BankFormRules, BankItemForm } from '/#/views/bank';
import { useApiType } from '@/hooks';
import { ApiBankItem } from '/#/api/blog/money/bank';
import { FormItemRule } from 'naive-ui';
import { bankApi } from '@/api';
import { CNumOption } from '/#/common/config';

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

// 修改银行账单 弹窗
export const useBankUpdateModel = (emit: (event: 'refresh', ...args: any[]) => void) => {
  const modelId = ref('');
  const showModal = ref(false);

  const formBtnLoading = ref(false);
  const modelFromRef = ref();
  const modelForm = reactive<BankItemForm>(Object.assign({}, modelFields));
  const modelRules = reactive<BankFormRules>({
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

  // 获取账单类型
  const { getBillTypeOption, getBankTypeOption } = useApiType();

  // 银行类型
  const bankTypeLabel = computed(() => {
    const find = unref(getBankTypeOption).find((f: CNumOption) => f.value === modelForm.bankType);
    return find ? find.label : '';
  });

  // 初始化
  const init = (row: ApiBankItem) => {
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
  const confirmForm = (e: MouseEvent) => {
    e.preventDefault();
    formBtnLoading.value = true;
    modelFromRef.value.validate((errors: FormItemRule) => {
      if (!errors && modelId.value) {
        bankApi
          .update({
            bankId: modelId.value,
            otherCost: modelForm.otherCost,
            tradeOtherPersonRemarks: modelForm.tradeOtherPersonRemarks,
            inflowOrOutflow: modelForm.inflowOrOutflow || 0,
            explain: modelForm.explain,
            place: modelForm.place,
            bankBillType: modelForm.bankBillType || 0,
          })
          .then(() => {
            showModal.value = false;
            emit('refresh');
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
    billTypeOption: getBillTypeOption,
    bankTypeLabel,
    init,
    confirmForm,
  };
};
