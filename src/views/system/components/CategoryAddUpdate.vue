<script lang="ts" setup>
  import { categoryTypeOption } from '@/constant';
  import { useCategoryAddUpdate } from '../hooks/useCategoryAddUpdate';

  const emit = defineEmits(['refresh']);

  const {
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
  } = useCategoryAddUpdate(emit);

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" :mask-closable="false" preset="dialog" :title="modelTitle">
    <n-form ref="modelFromRef" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="全局类型分类" path="type">
        <n-select v-model:value="modelForm.type" :options="categoryTypeOption" :virtual-scroll="false" placeholder="请选择全局类型分类"></n-select>
      </n-form-item>
      <n-form-item ref="modelFromValueRef" label="全局类型标识" path="value">
        <n-input-number
          v-model:value="modelForm.value"
          style="width: 100%"
          :disabled="!!modelForm.valueStr"
          placeholder="请输入全局类型标识"
          @update:value="valueInput" />
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
