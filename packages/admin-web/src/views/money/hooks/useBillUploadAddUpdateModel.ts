import { computed, nextTick, reactive, ref, unref } from 'vue';
import { BillUploadItemForm, BillUploadItemFormRules } from '/#/views/money/bill-upload';
import { useApiType, useSetting } from '@/hooks';
import { ApiBillUploadItem, ApiBillUploadSaveData } from '/#/api/blog/bill-upload';
import { FormItemRule } from 'naive-ui';
import { billUploadApi } from '@/api';
import {
  aliPayBillJudgeOptions,
  aliPayBillUploadType,
  bankBillJudgeOptions,
  bankBillUploadType,
  weChatBillJudgeOptions,
  weChatBillUploadType,
} from '@/constant';
import { weChatUploadFields } from '@shared/constants/api/we-chat-fields';
import { aliPayUploadFields } from '@shared/constants/api/ali-pay-fields';
import { bankUploadFields } from '@shared/constants/api/bank-fields';

const modelFields: BillUploadItemForm = {
  billUploadType: null,
  billType: null,
  handleType: null,
  inflowOrOutflow: null,
  billMethod: null,
  code: null,
};

// 修改、创建银行导入 弹窗
export const useBillUploadAddUpdateModel = (emit: (event: 'refresh', ...args: any[]) => void) => {
  // 弹窗
  const modelId = ref('');
  const showModal = ref(false);
  const modelTitle = computed(() => (unref(modelId) ? '修改' : '新增') + '账单导入');

  const formBtnLoading = ref(false);
  const modelFromRef = ref();
  const modelForm = reactive<BillUploadItemForm>(Object.assign({}, modelFields));
  const modelRules = reactive<BillUploadItemFormRules>({
    billUploadType: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: `请选择账单导入类型`,
    },
    handleType: {
      required: true,
      trigger: ['blur', 'change'],
      message: `请选择需处理类型`,
    },
    inflowOrOutflow: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: `请选择流入/流出`,
    },
    billMethod: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: `请选择账单方式`,
    },
    billType: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: `请选择账单类型`,
    },
    code: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入代码`,
    },
  });

  // 获取账单类型
  const { getBillTypeOption, getBillMethodOption } = useApiType();

  // 配置信息
  const { getAppThemeColor } = useSetting();

  const billJudgeKeyOptions = computed(() => {
    if (modelForm.billUploadType === weChatBillUploadType) {
      return weChatBillJudgeOptions.map((m) => ({ value: m.value, label: `${m.label}(${m.value})` }));
    } else if (modelForm.billUploadType === aliPayBillUploadType) {
      return aliPayBillJudgeOptions.map((m) => ({ value: m.value, label: `${m.label}(${m.value})` }));
    } else if (modelForm.billUploadType === bankBillUploadType) {
      return bankBillJudgeOptions.map((m) => ({ value: m.value, label: `${m.label}(${m.value})` }));
    }
    return [];
  });

  // 初始化
  const init = (row: ApiBillUploadItem) => {
    showModal.value = true;
    modelId.value = row?.billUploadId;
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
      if (!errors) {
        const params: ApiBillUploadSaveData = {
          billUploadType: modelForm.billUploadType || 0,
          handleType: modelForm.handleType || '',
          code: modelForm.code || '',
        };
        if (modelForm.handleType === 'inflowOrOutflow' && modelForm.inflowOrOutflow) {
          params.inflowOrOutflow = modelForm.inflowOrOutflow;
        }
        if (modelForm.handleType === 'billType' && modelForm.billType) {
          params.billType = modelForm.billType;
        }
        if (modelForm.handleType === 'billMethod' && modelForm.billMethod) {
          params.billMethod = modelForm.billMethod;
        }
        const request = modelId.value ? billUploadApi.update({ billUploadId: modelId.value, ...params }) : billUploadApi.save(params);
        request.then(() => {
          showModal.value = false;
          emit('refresh');
        });
      }
      formBtnLoading.value = false;
    });
  };

  const codeTooltipContent = computed(() => {
    let content = `<p>代码用于判断账单导入的类型</p>
                  <p>isAssignment 必须在开头，并且为 boolean 类型。</p>
                  <p>item 为账单的一条数据，其中的字段为：</p>`;
    if (modelForm.billUploadType === weChatBillUploadType) {
      content = content + weChatUploadFields.map((m) => `<p style="color: #ff5b5b;">${m.key}: ${m.label}（${m.type}）</p>`).join('');
    } else if (modelForm.billUploadType === aliPayBillUploadType) {
      content = content + aliPayUploadFields.map((m) => `<p style="color: #ff5b5b;">${m.key}: ${m.label}（${m.type}）</p>`).join('');
    } else if (modelForm.billUploadType === bankBillUploadType) {
      content = content + bankUploadFields.map((m) => `<p style="color: #ff5b5b;">${m.key}: ${m.label}（${m.type}）</p>`).join('');
    }
    return content;
  });

  return {
    modelTitle,
    showModal,
    modelFromRef,
    modelForm,
    modelRules,
    appThemeColor: unref(getAppThemeColor),
    formBtnLoading,
    billTypeOption: getBillTypeOption,
    billMethodOption: getBillMethodOption,
    billJudgeKeyOptions,
    codeTooltipContent,
    init,
    confirmForm,
  };
};
