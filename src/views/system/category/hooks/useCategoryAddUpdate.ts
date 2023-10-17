import { computed, nextTick, reactive, ref, unref } from 'vue';
import { CategoryItemForm, CategoryItemFormRules } from '/#/views/category';
import { FormItemRule } from 'naive-ui';
import { ApiCategoryItem, ApiCategorySaveData } from '/#/api/category';
import { categoryApi } from '@/api';
import { useApiTypeStore } from '@/store';

// 表单
const defaultModelForm = {
  type: null,
  value: null,
  valueStr: null,
  label: null,
};

// 全局类型管理 新建/修改 弹窗
export const useCategoryAddUpdate = (emit: (event: 'refurbish', ...args: any[]) => void) => {
  const apiTypeStore = useApiTypeStore();

  // 弹窗
  const modelId = ref('');
  const showModal = ref(false);
  const modelTitle = computed(() => (unref(modelId) ? '修改' : '新增') + '全局类型');

  const modelFromRef = ref();
  const modelFromValueRef = ref();
  const modelFromValueStrRef = ref();
  const modelForm = reactive<CategoryItemForm>(Object.assign({}, defaultModelForm));
  const valueValidator = (_rule: FormItemRule, value: null | number) => typeof value === 'number';
  const modelRules = reactive<CategoryItemFormRules>({
    type: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入全局类型分类`,
    },
    value: {
      required: true,
      validator: valueValidator,
      message: `请输入全局类型标识`,
      trigger: ['blur', 'change'],
    },
    valueStr: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入全局类型标识（字符串类型）`,
    },
    label: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入全局类型名称`,
    },
  });

  // 初始化表单全局类型标识规则（根据全局类型标识（字符串类型）判断）
  const initFromValueRules = (valueStr?: string) => {
    // 全局类型标识规则
    modelRules.value.required = !valueStr;
    modelRules.value.validator = !valueStr ? valueValidator : undefined;
    if (valueStr) {
      modelFromValueRef.value.restoreValidation();
    }
  };

  // 初始化表单全局类型标识（字符串类型）规则（根据全局类型标识判断）
  const initFromValueStrRules = (value?: number) => {
    // 全局类型标识（字符串类型）规则
    modelRules.valueStr.required = !value;
    if (typeof value === 'number') {
      modelFromValueStrRef.value.restoreValidation();
    }
  };

  // 全局类型标识
  const valueInput = (val: number) => {
    initFromValueStrRules(val);
  };

  // 全局类型标识（字符串类型）输入
  const valueStrInput = (val: string) => {
    initFromValueRules(val);
  };

  const formBtnLoading = ref(false);

  // 重置
  const resetFields = () => {
    Object.assign(modelForm, defaultModelForm);
    nextTick(() => {
      modelFromRef.value.restoreValidation();
    });
  };

  // 确定
  const confirmForm = (e: MouseEvent) => {
    e.preventDefault();
    formBtnLoading.value = true;
    modelFromRef.value.validate((errors: FormItemRule) => {
      if (!errors) {
        const params: ApiCategorySaveData = {
          type: modelForm.type || '',
          label: modelForm.label || '',
        };
        if (modelForm.value) {
          params.value = modelForm.value;
        } else if (modelForm.valueStr) {
          params.valueStr = modelForm.valueStr;
        }
        const request = modelId.value ? categoryApi.update({ categoryId: modelId.value, ...params }) : categoryApi.save(params);
        request.then(() => {
          showModal.value = false;
          if (modelForm.type) apiTypeStore.againGetApiType(modelForm.type);
          emit('refurbish');
        });
      }
      formBtnLoading.value = false;
    });
  };

  // 初始化
  const init = (row: ApiCategoryItem) => {
    showModal.value = true;
    modelId.value = row?.categoryId;
    resetFields();

    nextTick(() => {
      if (modelId.value) {
        modelForm.type = row.type;
        modelForm.value = row.value;
        initFromValueStrRules(row.value);
        modelForm.valueStr = row.valueStr;
        modelForm.label = row.label;
      } else {
        initFromValueRules();
        initFromValueStrRules();
      }
    });
  };
  return {
    showModal,
    modelTitle,
    modelFromRef,
    modelForm,
    modelRules,
    modelFromValueRef,
    modelFromValueStrRef,
    formBtnLoading,
    valueInput,
    valueStrInput,
    confirmForm,
    init,
  };
};
