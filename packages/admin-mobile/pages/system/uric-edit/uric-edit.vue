<template>
  <view class="uric-edit-page">
    <scroll-view scroll-y class="uric-edit-scroll">
      <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <view class="uric-edit-card card">
          <text class="uric-edit-section-title">基本信息</text>
          <u-form-item label="测量时间" prop="measureTime" required>
            <view class="uric-edit-select" @click="showTimePicker = true">
              <text :class="form.measureTime ? 'uric-edit-select-value' : 'uric-edit-select-placeholder'">
                {{ form.measureTime || '请选择测量时间' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#999" />
            </view>
          </u-form-item>
          <u-form-item label="测量方式" prop="measureType" required>
            <view class="uric-edit-select" @click="showTypeSelect = true">
              <text :class="form.measureType ? 'uric-edit-select-value' : 'uric-edit-select-placeholder'">
                {{ typeLabel || '请选择测量方式' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#999" />
            </view>
          </u-form-item>
        </view>

        <view class="uric-edit-card card">
          <text class="uric-edit-section-title">测量数值</text>
          <u-form-item label="尿酸值 (umol/L)" prop="uricAcid">
            <u-input v-model="form.uricAcid" type="number" placeholder="请输入尿酸测量值" :cursor-spacing="20" />
          </u-form-item>
          <u-form-item label="血糖值 (mmol/L)" prop="bloodGlucose">
            <u-input v-model="form.bloodGlucose" type="digit" placeholder="请输入血糖测量值" :cursor-spacing="20" />
          </u-form-item>
          <text class="uric-edit-tip">尿酸值与血糖值至少填写一项</text>
        </view>
      </u-form>
    </scroll-view>

    <u-select v-model="showTypeSelect" :list="measureTypeOption" title="选择测量方式" @confirm="onTypeConfirm" />
    <u-picker
      v-model="showTimePicker"
      mode="time"
      :params="timePickerParams"
      :default-time="form.measureTime || currentTime"
      @confirm="onTimeConfirm"
      @close="showTimePicker = false" />

    <view class="fixed-bottom-btn">
      <u-button type="primary" shape="circle" :loading="loading" @click="handleSave">保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { setRefreshFlag } from '../../../composables/useRefreshFlag';
  import { onLoad } from '@dcloudio/uni-app';
  import { uricApi } from '../../../api';
  import { measureTypeOption } from '../../../../shared/src/constants/api-type';
  import { ApiUricSaveData } from '/#/api/capital/uric';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');
  const showTypeSelect = ref(false);
  const showTimePicker = ref(false);
  const timePickerParams = { year: true, month: true, day: true, hour: true, minute: true };

  const currentTime = ref('');

  const form = reactive<ApiUricSaveData>({
    measureTime: '',
    measureType: '',
    uricAcid: undefined,
    bloodGlucose: undefined,
  });

  const typeLabel = computed(() => {
    const item = measureTypeOption.find((o) => o.value === form.measureType);
    return item?.label || '';
  });

  const rules = {
    measureTime: [{ required: true, message: '请选择测量时间', trigger: 'change' }],
    measureType: [{ required: true, message: '请选择测量方式', trigger: 'change' }],
  };

  function onTypeConfirm(e: any) {
    form.measureType = e[0]?.value ?? '';
  }

  function onTimeConfirm(e: any) {
    form.measureTime = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:00`;
    showTimePicker.value = false;
  }

  async function loadDetail(uricId: string) {
    try {
      const uric = await uricApi.details(uricId);
      if (uric) {
        form.measureTime = uric.measureTime || '';
        form.measureType = uric.measureType || '';
        form.uricAcid = uric.uricAcid || undefined;
        form.bloodGlucose = uric.bloodGlucose || undefined;
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
    if (!form.uricAcid && !form.bloodGlucose) {
      uni.showToast({ title: '尿酸值与血糖值至少填写一项', icon: 'none' });
      return;
    }
    loading.value = true;
    try {
      const data = {
        measureTime: form.measureTime,
        measureType: form.measureType,
        uricAcid: form.uricAcid,
        bloodGlucose: form.bloodGlucose,
      };
      if (editId.value) {
        await uricApi.update({ ...data, uricId: editId.value });
      } else {
        await uricApi.save(data);
      }
      uni.showToast({ title: '保存成功', icon: 'success' });
      setRefreshFlag('uric');
      setTimeout(() => uni.navigateBack(), 500);
    } finally {
      loading.value = false;
    }
  }

  onLoad((options) => {
    if (options?.id) {
      editId.value = options.id;
      uni.setNavigationBarTitle({ title: '编辑记录' });
      loadDetail(options.id);
    } else {
      uni.setNavigationBarTitle({ title: '新建记录' });
    }
    currentTime.value = (() => {
      const now = new Date();
      const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    })();
  });
</script>

<style lang="scss" scoped>
  .uric-edit-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    /* #ifdef H5 */
    height: 100%;
    /* #endif */
    background-color: $uni-bg-color-grey;
  }

  .uric-edit-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx 20rpx 0;
    box-sizing: border-box;
  }

  .uric-edit-card {
    padding: 24rpx;
    margin-bottom: 16rpx;
  }

  .uric-edit-section-title {
    font-size: $uni-font-size-lg;
    font-weight: 600;
    color: $uni-text-color;
    display: block;
    margin-bottom: 20rpx;
  }

  .uric-edit-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72rpx;
    padding: 0 24rpx;
    background-color: #f5f5f5;
    border-radius: 12rpx;
  }

  .uric-edit-select-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
  }

  .uric-edit-select-placeholder {
    font-size: $uni-font-size-base;
    color: $uni-text-color-placeholder;
  }

  .uric-edit-tip {
    font-size: $uni-font-size-sm;
    color: $uni-text-color-grey;
  }
</style>
