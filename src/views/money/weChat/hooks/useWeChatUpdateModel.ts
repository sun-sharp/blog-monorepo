import { nextTick, reactive, ref } from 'vue';
import { WeChatFormRules, WeChatItemForm } from '/#/views/we-chat';
import { useApiType } from '@/hooks';
import { FormItemRule } from 'naive-ui';
import { weChatApi } from '@/api';

const modelFields = {
  tradeTime: '',
  tradeType: '',
  tradeOtherPerson: '',
  tradeOtherPersonRemarks: '',
  goods: '',
  incomeOrPay: '',
  moneyAmount: null,
  otherCost: null,
  balance: undefined,
  paymentMethod: '',
  currentStatus: '',
  remarks: '',
  explain: '',
  place: '',
  inflowOrOutflow: null,
  billType: null,
  billMethod: null,
};

// 微信账单修改 弹窗
export const useWeChatUpdateModel = (emit: (event: 'refurbish', ...args: any[]) => void) => {
  const modelId = ref('');
  const showModal = ref(false);

  const formBtnLoading = ref(false);
  const modelFromRef = ref();
  const modelForm = reactive<WeChatItemForm>(Object.assign({}, modelFields));
  const modelRules = reactive<WeChatFormRules>({
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
    billMethod: {
      type: 'number',
      required: true,
      trigger: 'change',
      message: `请选择账单方式`,
    },
  });

  // 获取账单类型
  const { getBillTypeOption, getBillMethodOption } = useApiType();

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
  const confirmForm = (e: MouseEvent) => {
    e.preventDefault();
    formBtnLoading.value = true;
    modelFromRef.value.validate((errors: FormItemRule) => {
      if (!errors && modelId.value) {
        weChatApi
          .update({
            weChatId: modelId.value,
            tradeOtherPersonRemarks: modelForm.tradeOtherPersonRemarks,
            inflowOrOutflow: modelForm.inflowOrOutflow || 0,
            explain: modelForm.explain,
            place: modelForm.place,
            billType: modelForm.billType || 0,
            billMethod: modelForm.billMethod || 0,
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
