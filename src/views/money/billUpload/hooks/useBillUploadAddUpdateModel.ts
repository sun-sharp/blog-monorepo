import { computed, nextTick, reactive, ref, unref } from 'vue';
import { BillUploadItemForm, BillUploadItemFormRules } from '/#/views/money/bill-upload';
import { useApiType, useSetting } from '@/hooks';
import { ApiBillUploadItem, ApiBillUploadSaveData } from '/#/api/blog/bill-upload';
import { FormItemRule } from 'naive-ui';
import { billUploadApi } from '@/api';

const modelFields = {
  billUploadType: null,
  billType: null,
  billJudgeKey: null,
  judgeVal: [],
  judgeWay: null,
  judgeInputVal: null,
  handleType: null,
  inflowOrOutflow: null,
  billMethod: null,
  priorityWeight: 0,
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
    billJudgeKey: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入标识`,
    },
    judgeWay: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入标识`,
    },
  });

  // 获取账单类型
  const { getBillTypeOption, getBillMethodOption } = useApiType();

  // 配置信息
  const { getAppThemeColor } = useSetting();

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
    modelForm.judgeVal = [];
    nextTick(() => {
      modelFromRef.value.restoreValidation();
    });
  };

  // 取值新增
  const judgeInputAdd = () => {
    if (modelForm.judgeInputVal) {
      modelForm.judgeVal.push(modelForm.judgeInputVal);
      modelForm.judgeInputVal = null;
    }
  };

  // 取值删除
  const judgeValRemove = (idx: number) => {
    modelForm.judgeVal.splice(idx, 1);
  };

  // 提交
  const confirmForm = (e: MouseEvent) => {
    e.preventDefault();
    formBtnLoading.value = true;
    modelFromRef.value.validate((errors: FormItemRule) => {
      if (!errors) {
        const params: ApiBillUploadSaveData = {
          billUploadType: modelForm.billUploadType || 0,
          billJudgeKey: modelForm.billJudgeKey || '',
          handleType: modelForm.handleType || '',
          judgeVal: modelForm.judgeVal || [],
          judgeWay: modelForm.judgeWay || '',
          priorityWeight: modelForm.priorityWeight,
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
    init,
    judgeInputAdd,
    judgeValRemove,
    confirmForm,
  };
};
