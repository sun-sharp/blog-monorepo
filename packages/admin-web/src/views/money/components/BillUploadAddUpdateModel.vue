<script lang="ts" setup>
  // import { PlusCircleOutlined, TrashOutline } from '@/utils';
  import { useBillUploadAddUpdateModel } from '../hooks/useBillUploadAddUpdateModel';
  import { billUploadTypeOption, handleTypeOption, inflowOrOutflowOption } from '@/constant';
  import { InfoCircleOutlined } from '@/utils';

  const emit = defineEmits(['refresh']);

  const {
    showModal,
    modelTitle,
    modelFromRef,
    modelForm,
    modelRules,
    // appThemeColor,
    formBtnLoading,
    billTypeOption,
    billMethodOption,
    codeTooltipContent,
    init,
    confirmForm,
  } = useBillUploadAddUpdateModel(emit);

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" :mask-closable="false" preset="dialog" :title="modelTitle">
    <n-form ref="modelFromRef" class="add-update-model__body" :model="modelForm" :rules="modelRules" label-placement="top" :label-width="120">
      <n-form-item label="账单导入类型" path="billUploadType">
        <n-select
          v-model:value="modelForm.billUploadType"
          :options="billUploadTypeOption"
          :virtual-scroll="false"
          filterable
          clearable
          placeholder="请选择账单导入类型"></n-select>
      </n-form-item>
      <n-form-item label="需处理类型" path="handleType">
        <n-select
          v-model:value="modelForm.handleType"
          :options="handleTypeOption"
          :virtual-scroll="false"
          filterable
          clearable
          placeholder="请选择需处理类型"></n-select>
      </n-form-item>
      <n-form-item v-if="modelForm.handleType === 'inflowOrOutflow'" label="流入/流出" path="inflowOrOutflow">
        <n-select
          v-model:value="modelForm.inflowOrOutflow"
          :options="inflowOrOutflowOption"
          :virtual-scroll="false"
          filterable
          clearable
          placeholder="请选择流入/流出"></n-select>
      </n-form-item>
      <n-form-item v-else-if="modelForm.handleType === 'billType'" label="账单类型" path="billType">
        <n-select
          v-model:value="modelForm.billType"
          :options="billTypeOption"
          :virtual-scroll="false"
          filterable
          clearable
          placeholder="请选择账单类型"></n-select>
      </n-form-item>
      <n-form-item v-else-if="modelForm.handleType === 'billMethod'" label="账单方式" path="billMethod">
        <n-select
          v-model:value="modelForm.billMethod"
          :options="billMethodOption"
          :virtual-scroll="false"
          filterable
          clearable
          placeholder="请选择账单方式"></n-select>
      </n-form-item>
      <n-form-item path="code">
        <!-- 自定义标签内容 -->
        <template #label>
          <span style="display: flex; gap: 4px; align-items: center">
            <span>代码</span>
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-icon size="14" color="#f0a020">
                  <InfoCircleOutlined />
                </n-icon>
              </template>
              <div v-html="codeTooltipContent"></div>
            </n-tooltip>
          </span>
        </template>
        <n-input
          v-model:value="modelForm.code"
          type="textarea"
          :autosize="{
            minRows: 3,
          }"
          placeholder="请输入代码" />
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

<style lang="scss" scoped>
  .add-update-model {
    &__body {
      max-height: 60vh;
      padding-right: 20px;
      overflow-y: auto;
    }
  }
</style>
