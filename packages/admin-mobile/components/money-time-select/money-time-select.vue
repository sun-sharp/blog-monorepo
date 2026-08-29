<template>
  <u-popup v-model="popupShow" mode="bottom" round="20" @close="handleClose">
    <view class="time-select">
      <view class="time-select-header">
        <text class="time-select-title">选择时间范围</text>
        <u-icon name="close" size="40" @click="handleClose" />
      </view>
      <view class="time-select-quick">
        <view
          v-for="(item, index) in quickOptions"
          :key="index"
          :class="['time-select-quick-item', quickIndex === index && 'time-select-quick-active']"
          @click="onQuickSelect(index)">
          <text :class="['time-select-quick-text', quickIndex === index && 'time-select-quick-text-active']">{{ item.label }}</text>
        </view>
      </view>
      <view v-if="quickIndex === 4" class="time-select-custom">
        <view class="time-select-field" @click="openStartPicker">
          <text class="time-select-field-label">开始时间</text>
          <view class="time-select-field-value">
            <text :class="form.startTime ? 'time-select-date' : 'time-select-placeholder'">{{ form.startTime || '请选择' }}</text>
            <u-icon name="arrow-right" size="28" color="#ccc" />
          </view>
        </view>
        <view class="time-select-field" @click="openEndPicker">
          <text class="time-select-field-label">结束时间</text>
          <view class="time-select-field-value">
            <text :class="form.endTime ? 'time-select-date' : 'time-select-placeholder'">{{ form.endTime || '请选择' }}</text>
            <u-icon name="arrow-right" size="28" color="#ccc" />
          </view>
        </view>
      </view>
      <u-button type="primary" shape="circle" :disabled="quickIndex === 4 && (!form.startTime || !form.endTime)" @click="handleConfirm">确定</u-button>
    </view>
  </u-popup>
  <u-picker
    v-model="showStartPicker"
    mode="time"
    :params="pickerParams"
    :start-year="1950"
    :end-year="startEndYear"
    :default-time="form.startTime || today"
    @confirm="onStartConfirm" />
  <u-picker
    v-model="showEndPicker"
    mode="time"
    :params="pickerParams"
    :start-year="endStartYear"
    :end-year="2050"
    :default-time="form.endTime || today"
    @confirm="onEndConfirm" />
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';

  const props = defineProps<{ show: boolean }>();
  const emit = defineEmits(['update:show', 'confirm']);

  const quickOptions = [
    { label: '近7天', days: 7 },
    { label: '近30天', days: 30 },
    { label: '近90天', days: 90 },
    { label: '近1年', days: 365 },
    { label: '自定义', days: 0 },
  ];

  const quickIndex = ref(0);
  const showStartPicker = ref(false);
  const showEndPicker = ref(false);

  const form = reactive({ startTime: '', endTime: '' });

  const pickerParams = { year: true, month: true, day: true, hour: false, minute: false, second: false, timestamp: false };

  const popupShow = computed({
    get: () => props.show,
    set: (val: boolean) => emit('update:show', val),
  });

  const today = computed(() => {
    const d = new Date();
    return formatDate(d);
  });

  const endStartYear = computed(() => {
    if (form.startTime) return Number(form.startTime.slice(0, 4));
    return 1950;
  });

  const startEndYear = computed(() => {
    if (form.endTime) return Number(form.endTime.slice(0, 4));
    return 2050;
  });

  function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getDateRange(days: number) {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - days * 24 * 60 * 60 * 1000);
    return { startTime: formatDate(start), endTime: formatDate(end) };
  }

  function onQuickSelect(index: number) {
    quickIndex.value = index;
    if (index < 4) {
      const range = getDateRange(quickOptions[index].days);
      form.startTime = range.startTime;
      form.endTime = range.endTime;
    }
  }

  function openStartPicker() {
    showStartPicker.value = true;
  }

  function openEndPicker() {
    showEndPicker.value = true;
  }

  function onStartConfirm(e: any) {
    const startTime = `${e.year}-${e.month}-${e.day}`;
    if (form.endTime && startTime >= form.endTime) {
      uni.showToast({ title: '开始时间需早于结束时间', icon: 'none' });
      return;
    }
    form.startTime = startTime;
    showStartPicker.value = false;
  }

  function onEndConfirm(e: any) {
    const endTime = `${e.year}-${e.month}-${e.day}`;
    if (form.startTime && endTime <= form.startTime) {
      uni.showToast({ title: '结束时间需晚于开始时间', icon: 'none' });
      return;
    }
    form.endTime = endTime;
    showEndPicker.value = false;
  }

  function handleConfirm() {
    if (quickIndex.value === 4 && form.startTime >= form.endTime) {
      uni.showToast({ title: '结束时间需晚于开始时间', icon: 'none' });
      return;
    }
    let result: { startTime: string; endTime: string };
    if (quickIndex.value === 4) {
      result = { startTime: form.startTime, endTime: form.endTime };
    } else {
      result = getDateRange(quickOptions[quickIndex.value].days);
    }
    emit('confirm', result);
    handleClose();
  }

  function handleClose() {
    emit('update:show', false);
  }
</script>

<style lang="scss" scoped>
  .time-select {
    padding: 30rpx;
    padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  }

  .time-select-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
  }

  .time-select-title {
    font-size: $uni-font-size-lg;
    font-weight: bold;
  }

  .time-select-quick {
    display: flex;
    gap: 16rpx;
    margin-bottom: 30rpx;
  }

  .time-select-quick-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12rpx 0;
    border-radius: 12rpx;
    background-color: #f5f5f5;
  }

  .time-select-quick-active {
    background-color: #007aff;
  }

  .time-select-quick-text {
    font-size: $uni-font-size-sm;
    color: #666;
  }

  .time-select-quick-text-active {
    color: #fff;
  }

  .time-select-custom {
    margin-bottom: 30rpx;
  }

  .time-select-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eee;
  }

  .time-select-field-label {
    font-size: $uni-font-size-base;
    color: #333;
  }

  .time-select-field-value {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }

  .time-select-date {
    font-size: $uni-font-size-base;
    color: #333;
  }

  .time-select-placeholder {
    font-size: $uni-font-size-base;
    color: #ccc;
  }
</style>
