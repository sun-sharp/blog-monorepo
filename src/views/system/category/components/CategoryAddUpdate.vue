<script lang="ts" setup>
  import { computed, unref, ref, reactive, nextTick } from 'vue';
  import { CategoryItemForm, CategoryItemFormRules } from '/#/views/category';
  import { FormItemRule } from 'naive-ui';
  import { ApiCategorySaveData } from '/#/api/category';
  import { categoryApi } from '@/api';

  const emits = defineEmits(['refurbish']);

  // 弹窗
  const modelId = ref('');
  const showModal = ref(false);
  const modelTitle = computed(() => (unref(modelId) ? '修改' : '新增') + '全局类型');

  // 表单
  const modelFields = {
    type: null,
    value: null,
    valueStr: null,
    label: null,
  };
  const modelFromRef = ref();
  const modelFromValueRef = ref();
  const modelFromValueStrRef = ref();
  const modelForm = reactive<CategoryItemForm>(Object.assign({}, modelFields));
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
      message: `请输入全局类型分类`,
      trigger: ['blur', 'change'],
    },
    valueStr: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入全局类型分类（字符串类型）`,
    },
    label: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入全局类型分类`,
    },
  });

  // 初始化表单全局类型标识规则
  const initFromValueRules = (valueStr?: string) => {
    // 全局类型标识规则
    modelRules.value.required = !valueStr;
    modelRules.value.validator = !valueStr ? valueValidator : undefined;
    if (valueStr) {
      modelFromValueRef.value.restoreValidation();
    }
  };

  // 初始化表单全局类型标识（字符串类型）规则
  const initFromValueStrRules = (value?: number) => {
    // 全局类型标识（字符串类型）规则
    modelRules.valueStr.required = !value;
    if (typeof value === 'number') {
      modelFromValueStrRef.value.restoreValidation();
    }
  };

  // 全局类型标识（字符串类型）输入
  const valueStrInput = (val: string) => {
    initFromValueRules(val);
  };

  // 全局类型标识
  const valueInputValue = (val: number) => {
    initFromValueStrRules(val);
  };

  const formBtnLoading = ref(false);

  // 重置
  const resetFields = () => {
    Object.assign(modelForm, modelFields);
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
        // const request = modelId.value ? menuApi.updateMenu({ menuId: modelId.value, ...params }) : menuApi.saveMenu(params);
        categoryApi.save(params).then(() => {
          showModal.value = false;
          emits('refurbish');
        });
      }
      formBtnLoading.value = false;
    });
  };

  // 初始化
  const init = (row: any) => {
    showModal.value = true;
    modelId.value = row?.userId;
    resetFields();

    nextTick(() => {
      console.log(modelRules);
      if (modelId.value) {
      } else {
        initFromValueRules();
        initFromValueStrRules();
      }
    });
  };

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" :mask-closable="false" preset="dialog" :title="modelTitle">
    <n-form ref="modelFromRef" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="全局类型分类" path="type">
        <n-input v-model:value="modelForm.type" placeholder="请输入全局类型分类" />
      </n-form-item>
      <n-form-item ref="modelFromValueRef" label="全局类型标识" path="value">
        <n-input-number
          v-model:value="modelForm.value"
          style="width: 100%"
          :disabled="!!modelForm.valueStr"
          placeholder="请输入全局类型标识"
          @update:value="valueInputValue"
        />
      </n-form-item>
      <n-form-item ref="modelFromValueStrRef" label="全局类型标识（字符串类型）" path="valueStr">
        <n-input v-model:value="modelForm.valueStr" :disabled="!!modelForm.value" placeholder="请输入全局类型标识（字符串类型）" @input="valueStrInput" />
      </n-form-item>
      <n-form-item label="全局类型名称" path="label">
        <n-input v-model:value="modelForm.label" placeholder="请输入全局类型名称" />
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
