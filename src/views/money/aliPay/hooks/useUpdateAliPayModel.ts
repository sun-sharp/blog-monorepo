import { nextTick, reactive, ref } from 'vue';
import { AliPayFormRules, AliPayItemForm } from '/#/views/ali-pay';
import { useApiType } from '@/hooks';
import { FormItemRule } from 'naive-ui';
import { aliPayApi } from '@/api';

const modelFields = {
  tradeTime: '',
  tradeType: '',
  tradeOtherPerson: '',
  tradeOtherPersonRemarks: '',
  productDescription: '',
  incomeOrPay: '',
  moneyAmount: null,
  balance: undefined,
  balanceBaby: undefined,
  paymentMethod: '',
  oppositeAccount: '',
  explain: '',
  place: '',
  inflowOrOutflow: null,
  billMethod: null,
  billType: null,
};

// 修改支付宝账单 弹窗
export const useUpdateAliPayModel = (emit: (event: 'refurbish', ...args: any[]) => void) => {
  const modelId = ref('');
  const showModal = ref(false);

  const formBtnLoading = ref(false);
  const modelFromRef = ref();
  const modelForm = reactive<AliPayItemForm>(Object.assign({}, modelFields));
  const modelRules = reactive<AliPayFormRules>({
    inflowOrOutflow: {
      type: 'number',
      required: true,
      trigger: 'change',
      message: `请选择流入/流出`,
    },
    billMethod: {
      type: 'number',
      required: true,
      trigger: 'change',
      message: `请选择账单方式`,
    },
    billType: {
      type: 'number',
      required: true,
      trigger: 'change',
      message: `请选择账单类型`,
    },
  });

  // 获取账单类型
  const { getBillTypeOption, getBillMethodOption } = useApiType();

  // 初始化
  const init = (row: any) => {
    showModal.value = true;
    modelId.value = row?.aliPayId;
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
        aliPayApi
          .update({
            aliPayId: modelId.value,
            tradeOtherPersonRemarks: modelForm.tradeOtherPersonRemarks,
            inflowOrOutflow: modelForm.inflowOrOutflow || 0,
            explain: modelForm.explain,
            place: modelForm.place,
            billMethod: modelForm.billMethod || 0,
            billType: modelForm.billType || 0,
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
    billTypeOption: getBillTypeOption,
    billMethodOption: getBillMethodOption,
    init,
    confirmForm,
  };
};
