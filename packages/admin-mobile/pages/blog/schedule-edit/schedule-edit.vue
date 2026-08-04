<template>
  <view class="schedule-edit-page">
    <scroll-view scroll-y class="schedule-edit-scroll">
      <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <view class="schedule-edit-card card">
          <u-form-item label="标题" prop="title">
            <u-input v-model="form.title" placeholder="请输入日程标题" :cursor-spacing="20" />
          </u-form-item>
          <u-form-item label="内容" prop="content">
            <u-textarea v-model="form.content" placeholder="请输入日程内容" :cursor-spacing="20" />
          </u-form-item>
        </view>
        <view class="schedule-edit-card card">
          <u-form-item label="开始日期" prop="startDate">
            <view class="schedule-edit-select" @click="showStartCalendar = true">
              <text :class="form.startDate ? 'schedule-edit-select-value' : 'schedule-edit-select-placeholder'">{{ form.startDate || '请选择开始日期' }}</text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
          <u-form-item label="结束日期" prop="endDate">
            <view class="schedule-edit-select" @click="showEndCalendar = true">
              <text :class="form.endDate ? 'schedule-edit-select-value' : 'schedule-edit-select-placeholder'">{{ form.endDate || '请选择结束日期' }}</text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
          <u-form-item label="开始时间" prop="startTime">
            <view class="schedule-edit-select" @click="showStartTime = true">
              <text :class="form.startTime ? 'schedule-edit-select-value' : 'schedule-edit-select-placeholder'">{{ form.startTime || '请选择开始时间' }}</text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
          <u-form-item label="结束时间" prop="endTime">
            <view class="schedule-edit-select" @click="showEndTime = true">
              <text :class="form.endTime ? 'schedule-edit-select-value' : 'schedule-edit-select-placeholder'">{{ form.endTime || '请选择结束时间' }}</text>
              <u-icon name="arrow-right" size="28" color="#bbb" />
            </view>
          </u-form-item>
        </view>
      </u-form>
    </scroll-view>

    <u-calendar :show="showStartCalendar" mode="date" @confirm="onStartConfirm" @close="showStartCalendar = false" />
    <u-calendar :show="showEndCalendar" mode="date" @confirm="onEndConfirm" @close="showEndCalendar = false" />
    <u-picker :show="showStartTime" mode="time" @confirm="onStartTimeConfirm" @close="showStartTime = false" />
    <u-picker :show="showEndTime" mode="time" @confirm="onEndTimeConfirm" @close="showEndTime = false" />

    <view class="fixed-bottom-btn">
      <u-button type="primary" shape="circle" :loading="loading" @click="handleSave">保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { scheduleAPi } from '../../../api';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');
  const showStartCalendar = ref(false);
  const showEndCalendar = ref(false);
  const showStartTime = ref(false);
  const showEndTime = ref(false);

  const form = reactive({
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
  });

  const rules = {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
    startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
    endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  };

  function onStartConfirm(e: any) {
    form.startDate = e[0];
    showStartCalendar.value = false;
  }

  function onEndConfirm(e: any) {
    form.endDate = e[0];
    showEndCalendar.value = false;
  }

  function onStartTimeConfirm(e: any) {
    form.startTime = `${e.hour}:${e.minute}`;
    showStartTime.value = false;
  }

  function onEndTimeConfirm(e: any) {
    form.endTime = `${e.hour}:${e.minute}`;
    showEndTime.value = false;
  }

  async function loadDetail(id: string) {
    try {
      const item = await scheduleAPi.getOne(id);
      if (item) {
        form.title = item.title || '';
        form.content = item.content || '';
        form.startDate = item.startDate || '';
        form.endDate = item.endDate || '';
        form.startTime = item.startTime || '';
        form.endTime = item.endTime || '';
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSave() {
    try {
      await formRef.value?.validate();
    } catch {
      return;
    }
    loading.value = true;
    try {
      const data = { ...form };
      if (editId.value) {
        await scheduleAPi.update({ ...data, scheduleId: editId.value });
      } else {
        await scheduleAPi.save(data);
      }
      uni.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => uni.navigateBack(), 500);
    } finally {
      loading.value = false;
    }
  }

  onLoad((options) => {
    if (options?.id) {
      editId.value = options.id;
      uni.setNavigationBarTitle({ title: '编辑日程' });
      loadDetail(options.id);
    } else {
      uni.setNavigationBarTitle({ title: '新建日程' });
    }
  });
</script>

<style lang="scss" scoped>
  .schedule-edit-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .schedule-edit-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx 20rpx 0;
    box-sizing: border-box;
  }

  .schedule-edit-card {
    padding: 24rpx;
    margin-bottom: 16rpx;
  }

  .schedule-edit-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72rpx;
    padding: 0 24rpx;
    background-color: #f5f5f5;
    border-radius: 12rpx;
  }

  .schedule-edit-select-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
  }

  .schedule-edit-select-placeholder {
    font-size: $uni-font-size-base;
    color: $uni-text-color-placeholder;
  }
</style>
