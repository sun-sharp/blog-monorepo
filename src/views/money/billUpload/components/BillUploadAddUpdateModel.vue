<script lang="ts" setup>
  import { PlusCircleOutlined, TrashOutline } from '@/utils';
  import { useBillUploadAddUpdateModel } from '../hooks/useBillUploadAddUpdateModel';
  import { billUploadTypeOption, handleTypeOption, judgeWayOption, inflowOrOutflowOption, billJudgeKeyOption } from '@/constant';

  const emit = defineEmits(['refresh']);

  const {
    showModal,
    modelTitle,
    modelFromRef,
    modelForm,
    modelRules,
    appThemeColor,
    formBtnLoading,
    billTypeOption,
    billMethodOption,
    init,
    judgeInputAdd,
    judgeValRemove,
    confirmForm,
  } = useBillUploadAddUpdateModel(emit);

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" :mask-closable="false" preset="dialog" :title="modelTitle">
    <n-form ref="modelFromRef" class="we-chat-update-model__body" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="账单导入类型" path="billUploadType">
        <n-select
          v-model:value="modelForm.billUploadType"
          :options="billUploadTypeOption"
          :virtual-scroll="false"
          filterable
          clearable
          placeholder="请选择账单导入类型"
        ></n-select>
      </n-form-item>
      <n-form-item label="需处理类型" path="handleType">
        <n-select
          v-model:value="modelForm.handleType"
          :options="handleTypeOption"
          :virtual-scroll="false"
          filterable
          clearable
          placeholder="请选择需处理类型"
        ></n-select>
      </n-form-item>
      <n-form-item v-if="modelForm.handleType === 'inflowOrOutflow'" label="流入/流出" path="inflowOrOutflow">
        <n-select
          v-model:value="modelForm.inflowOrOutflow"
          :options="inflowOrOutflowOption"
          :virtual-scroll="false"
          filterable
          clearable
          placeholder="请选择流入/流出"
        ></n-select>
      </n-form-item>
      <n-form-item v-else-if="modelForm.handleType === 'billType'" label="账单类型" path="billType">
        <n-select
          v-model:value="modelForm.billType"
          :options="billTypeOption"
          :virtual-scroll="false"
          filterable
          clearable
          placeholder="请选择账单类型"
        ></n-select>
      </n-form-item>
      <n-form-item v-else-if="modelForm.handleType === 'billMethod'" label="账单方式" path="billMethod">
        <n-select
          v-model:value="modelForm.billMethod"
          :options="billMethodOption"
          :virtual-scroll="false"
          filterable
          clearable
          placeholder="请选择账单方式"
        ></n-select>
      </n-form-item>
      <n-form-item label="账单导入字段" path="billJudgeKey">
        <n-select
          v-model:value="modelForm.billJudgeKey"
          :options="billJudgeKeyOption"
          :virtual-scroll="false"
          filterable
          clearable
          placeholder="请选择账单导入字段"
        ></n-select>
      </n-form-item>
      <n-form-item label="账单导入方式" path="judgeWay">
        <n-select
          v-model:value="modelForm.judgeWay"
          :options="judgeWayOption"
          :virtual-scroll="false"
          filterable
          clearable
          placeholder="请选择账单导入方式"
        ></n-select>
      </n-form-item>
      <n-form-item label="优先权重" path="priorityWeight">
        <n-input-number v-model:value="modelForm.priorityWeight" class="w-full" />
      </n-form-item>
      <n-form-item label="新增的取值" path="judgeInputVal">
        <n-input v-model:value="modelForm.judgeInputVal" placeholder="请输入新增的取值" />
        <n-icon
          :class="['ml-20', { 'cursor-pointer': modelForm.judgeInputVal }]"
          :color="modelForm.judgeInputVal ? appThemeColor : '#aaa'"
          @click="judgeInputAdd()"
        >
          <PlusCircleOutlined />
        </n-icon>
      </n-form-item>
      <n-form-item v-if="modelForm.judgeVal.length > 0" label="取值" path="judgeVal">
        <div class="flex fw-w">
          <div v-for="(val, idx) in modelForm.judgeVal" :key="val" class="flex ai-c mv-5">
            <span class="mr-10" :style="`color: ${appThemeColor}`">{{ val }}</span>
            <n-icon class="cursor-pointer mr-20" color="#d03050" @click="judgeValRemove(idx)">
              <TrashOutline />
            </n-icon>
          </div>
        </div>
      </n-form-item>
      <!-- <n-form-item label="其它费用">
        <n-input-number v-model:value="modelForm.otherCost">
          <template #prefix>￥</template>
        </n-input-number>
      </n-form-item>
      <n-form-item label="流入/流出" path="inflowOrOutflow">
        <n-radio-group v-model:value="modelForm.inflowOrOutflow" name="radiogroup">
          <n-space>
            <n-radio v-for="item in inflowOrOutflowOption" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      
      <n-form-item label="使用地点" path="place">
        <n-input v-model:value="modelForm.place" type="textarea" :rows="2" placeholder="请输入使用地点" />
      </n-form-item>

      <n-form-item label="银行账单类型" path="bankBillType">
        <n-select v-model:value="modelForm.bankBillType" filterable :options="billTypeOption" placeholder="请选择银行账单类型" />
      </n-form-item> -->
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" :disabled="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style lang="scss">
  .we-chat-update-model {
    &__body {
      max-height: 60vh;
      padding-right: 20px;
      overflow-y: auto;
    }
  }
</style>
