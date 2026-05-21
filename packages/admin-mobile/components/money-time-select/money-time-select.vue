<template>
  <u-popup :show="show" mode="bottom" @close="handleClose">
    <view class="money-time-select">
      <view class="money-time-select-header">
        <text class="money-time-select-title">选择时间范围</text>
        <u-icon name="close" @click="handleClose" />
      </view>
      <u-subsection :list="quickOptions" :current="quickIndex" @change="handleQuickChange" />
      <view v-if="quickIndex === 3" class="money-time-select-custom">
        <u-form :model="form" label-position="top">
          <u-form-item label="开始时间">
            <u-input v-model="form.startTime" placeholder="请选择开始时间" readonly @click="showStartPicker = true" />
          </u-form-item>
          <u-form-item label="结束时间">
            <u-input v-model="form.endTime" placeholder="请选择结束时间" readonly @click="showEndPicker = true" />
          </u-form-item>
        </u-form>
      </view>
      <u-calendar :show="showStartPicker" mode="date" @confirm="onStartConfirm" @close="showStartPicker = false" />
      <u-calendar :show="showEndPicker" mode="date" @confirm="onEndConfirm" @close="showEndPicker = false" />
      <view class="money-time-select-footer">
        <u-button type="primary" :disabled="quickIndex === 3 && (!form.startTime || !form.endTime)" @click="handleConfirm">确定</u-button>
      </view>
    </view>
  </u-popup>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';

  defineProps<{
    show: boolean;
  }>();

  const emit = defineEmits(['update:show', 'confirm']);

  const quickOptions = ['近7天', '近30天', '近90天', '自定义'];
  const quickIndex = ref(0);
  const showStartPicker = ref(false);
  const showEndPicker = ref(false);

  const form = reactive({
    startTime: '',
    endTime: '',
  });

  function getDateRange(days: number) {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - days * 24 * 60 * 60 * 1000);
    return {
      startTime: formatDate(start),
      endTime: formatDate(end),
    };
  }

  function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function handleQuickChange(index: number) {
    quickIndex.value = index;
  }

  function onStartConfirm(e: any) {
    form.startTime = e[0];
    showStartPicker.value = false;
  }

  function onEndConfirm(e: any) {
    form.endTime = e[0];
    showEndPicker.value = false;
  }

  function handleConfirm() {
    let result: { startTime: string; endTime: string };
    switch (quickIndex.value) {
      case 0:
        result = getDateRange(7);
        break;
      case 1:
        result = getDateRange(30);
        break;
      case 2:
        result = getDateRange(90);
        break;
      case 3:
        result = { startTime: form.startTime, endTime: form.endTime };
        break;
      default:
        result = getDateRange(7);
    }
    emit('confirm', result);
    handleClose();
  }

  function handleClose() {
    emit('update:show', false);
  }
</script>

<style lang="scss" scoped>
  .money-time-select {
    padding: 30rpx;
    padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  }

  .money-time-select-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
  }

  .money-time-select-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .money-time-select-custom {
    margin-top: 30rpx;
  }

  .money-time-select-footer {
    margin-top: 30rpx;
  }
</style>
