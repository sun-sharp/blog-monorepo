<template>
  <view class="schedule-edit-page">
    <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <u-form-item label="标题" prop="title">
        <u-input v-model="form.title" placeholder="请输入日程标题" />
      </u-form-item>
      <u-form-item label="内容" prop="content">
        <u-textarea v-model="form.content" placeholder="请输入日程内容" />
      </u-form-item>
      <u-form-item label="开始日期" prop="startDate">
        <u-input v-model="form.startDate" placeholder="请选择开始日期" readonly @click="showStartCalendar = true" />
      </u-form-item>
      <u-form-item label="结束日期" prop="endDate">
        <u-input v-model="form.endDate" placeholder="请选择结束日期" readonly @click="showEndCalendar = true" />
      </u-form-item>
      <u-form-item label="开始时间" prop="startTime">
        <u-input v-model="form.startTime" placeholder="请选择开始时间" readonly @click="showStartTime = true" />
      </u-form-item>
      <u-form-item label="结束时间" prop="endTime">
        <u-input v-model="form.endTime" placeholder="请选择结束时间" readonly @click="showEndTime = true" />
      </u-form-item>
    </u-form>

    <u-calendar :show="showStartCalendar" mode="date" @confirm="onStartConfirm" @close="showStartCalendar = false" />
    <u-calendar :show="showEndCalendar" mode="date" @confirm="onEndConfirm" @close="showEndCalendar = false" />
    <u-picker :show="showStartTime" mode="time" @confirm="onStartTimeConfirm" @close="showStartTime = false" />
    <u-picker :show="showEndTime" mode="time" @confirm="onEndTimeConfirm" @close="showEndTime = false" />

    <view class="fixed-bottom-btn">
      <u-button type="primary" :loading="loading" @click="handleSave">保存</u-button>
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
    }
  });
</script>

<style lang="scss" scoped>
  .schedule-edit-page {
    padding: 20rpx;
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  }
</style>
