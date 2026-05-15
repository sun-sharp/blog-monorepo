<script lang="ts" setup>
  import { format } from 'date-fns';
  import { useAddUpdateModel } from '../hooks/useScheduleAddUpdateModel';

  const emit = defineEmits(['finish']);

  const { showModal, modelTitle, modelFromRef, modelForm, modelRules, formBtnLoading, init, confirmForm } = useAddUpdateModel(emit);

  const disabledStartDate = (ts: number) => {
    const date = new Date(ts).getTime();
    const newDate = new Date();
    const year = newDate.getFullYear();
    const mon = newDate.getMonth();
    const day = newDate.getDate();
    const newTime = new Date(year, mon, day).getTime();
    return date < newTime;
  };

  const disabledEndDate = (ts: number) => {
    const date = format(new Date(ts), 'yyyy-MM-dd');
    const dateNum = new Date(date).getTime();
    const startNum = modelForm.startDate ? new Date(modelForm.startDate).getTime() : 0;
    return startNum !== 0 ? dateNum < startNum : false;
  };

  const endTimeIsHourDisabled = (hour: number) => {
    const startNum = modelForm.startTime ? new Date(modelForm.startTime).getHours() : null;
    return startNum !== null ? hour < startNum : false;
  };

  const endTimeIsMinuteDisabled = (min: number, hour: number | null) => {
    const startHour = modelForm.startTime ? new Date(modelForm.startTime).getHours() : null;
    const startMin = modelForm.startTime ? new Date(modelForm.startTime).getMinutes() : null;
    if (startMin !== null && startHour !== null) {
      if (hour === startHour) {
        return min <= startMin;
      } else {
        return min < startMin;
      }
    }
    return false;
  };

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" :mask-closable="false" preset="dialog" :title="modelTitle">
    <n-form ref="modelFromRef" class="add-update-model__body" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="开始日期" path="startDate">
        <n-date-picker
          v-model:formatted-value="modelForm.startDate"
          style="width: 100%"
          type="date"
          clearable
          :is-date-disabled="disabledStartDate"
          value-format="yyyy-MM-dd" />
      </n-form-item>
      <n-form-item label="结束日期" path="endDate">
        <n-date-picker
          v-model:formatted-value="modelForm.endDate"
          style="width: 100%"
          type="date"
          :is-date-disabled="disabledEndDate"
          clearable
          value-format="yyyy-MM-dd" />
      </n-form-item>
      <n-form-item label="开始时间" path="startTime">
        <n-time-picker
          v-model:formatted-value="modelForm.startTime"
          style="width: 100%"
          :minutes="[0]"
          :seconds="[0]"
          format="HH:mm a"
          value-format="HH:mm:ss"
          clearable />
      </n-form-item>
      <n-form-item label="结束时间" path="endTime">
        <n-time-picker
          v-model:formatted-value="modelForm.endTime"
          style="width: 100%"
          :minutes="[0, 59]"
          :seconds="[0]"
          clearable
          :is-hour-disabled="endTimeIsHourDisabled"
          :is-minute-disabled="endTimeIsMinuteDisabled"
          format="hh:mm a"
          value-format="HH:mm:ss" />
      </n-form-item>
      <n-form-item label="标题" path="title">
        <n-input v-model:value="modelForm.title" placeholder="请输入标题" clearable :max-length="100" />
      </n-form-item>
      <n-form-item label="内容" path="content">
        <n-input v-model:value="modelForm.content" type="textarea" :rows="2" placeholder="请输入内容" :max-length="1000" />
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
