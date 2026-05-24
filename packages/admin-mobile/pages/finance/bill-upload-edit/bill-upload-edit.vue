<template>
  <view class="bill-upload-edit-page">
    <scroll-view scroll-y class="bill-upload-edit-scroll">
      <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <u-form-item label="账单导入类型" prop="billUploadType">
          <view class="bill-upload-edit-select" @click="showBillUploadTypeSelect = true">
            <text class="bill-upload-edit-select-value">{{ billUploadTypeLabel || '请选择' }}</text>
            <u-icon name="arrow-right" size="28" color="#999" />
          </view>
        </u-form-item>
        <u-form-item label="需处理类型" prop="handleType">
          <view class="bill-upload-edit-select" @click="showHandleTypeSelect = true">
            <text class="bill-upload-edit-select-value">{{ handleTypeLabel || '请选择' }}</text>
            <u-icon name="arrow-right" size="28" color="#999" />
          </view>
        </u-form-item>
        <u-form-item label="流入/流出">
          <view class="bill-upload-edit-select" @click="showInflowSelect = true">
            <text class="bill-upload-edit-select-value">{{ inflowLabel || '不限' }}</text>
            <u-icon name="arrow-right" size="28" color="#999" />
          </view>
        </u-form-item>
        <u-form-item label="判断字段" prop="billJudgeKey">
          <u-input v-model="form.billJudgeKey" placeholder="请输入判断字段" />
        </u-form-item>
        <u-form-item label="判断方式" prop="judgeWay">
          <view class="bill-upload-edit-select" @click="showJudgeWaySelect = true">
            <text class="bill-upload-edit-select-value">{{ judgeWayLabel || '请选择' }}</text>
            <u-icon name="arrow-right" size="28" color="#999" />
          </view>
        </u-form-item>
      </u-form>
    </scroll-view>

    <u-select
      v-model="showBillUploadTypeSelect"
      :list="billUploadTypeList"
      title="选择导入类型"
      @confirm="
        (e: any) => {
          form.billUploadType = e[0]?.value ?? 1;
        }
      " />
    <u-select
      v-model="showHandleTypeSelect"
      :list="handleTypeList"
      title="选择处理类型"
      @confirm="
        (e: any) => {
          form.handleType = e[0]?.value ?? '';
        }
      " />
    <u-select
      v-model="showInflowSelect"
      :list="inflowOrOutflowList"
      title="选择流入/流出"
      @confirm="
        (e: any) => {
          form.inflowOrOutflow = e[0]?.value ?? 0;
        }
      " />
    <u-select
      v-model="showJudgeWaySelect"
      :list="judgeWayList"
      title="选择判断方式"
      @confirm="
        (e: any) => {
          form.judgeWay = e[0]?.value ?? 'indexOf';
        }
      " />

    <view class="fixed-bottom-btn">
      <u-button type="primary" :loading="loading" @click="handleSave">保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { billUploadApi } from '../../../api';
  import { billUploadTypeOption, handleTypeOption, inflowOrOutflowOption, judgeWayOption } from '../../../../shared/src/constants/api-type';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');
  const showBillUploadTypeSelect = ref(false);
  const showHandleTypeSelect = ref(false);
  const showInflowSelect = ref(false);
  const showJudgeWaySelect = ref(false);

  const billUploadTypeList = billUploadTypeOption.map((item) => ({ label: item.label, value: item.value }));
  const handleTypeList = handleTypeOption.map((item) => ({ label: item.label, value: item.value }));
  const inflowOrOutflowList = [{ label: '不限', value: 0 }, ...inflowOrOutflowOption.map((item) => ({ label: item.label, value: item.value }))];
  const judgeWayList = judgeWayOption.map((item) => ({ label: item.label, value: item.value }));

  const form = reactive({
    billUploadType: 1,
    billJudgeKey: '',
    handleType: '' as string | number,
    inflowOrOutflow: 0,
    billType: 0,
    billMethod: 0,
    priorityWeight: 0,
    judgeWay: 'indexOf' as string,
    judgeVal: [] as string[],
  });

  const billUploadTypeLabel = computed(() => billUploadTypeList.find((r) => r.value === form.billUploadType)?.label || '');
  const handleTypeLabel = computed(() => handleTypeList.find((r) => r.value === form.handleType)?.label || '');
  const inflowLabel = computed(() => inflowOrOutflowList.find((r) => r.value === form.inflowOrOutflow)?.label || '');
  const judgeWayLabel = computed(() => judgeWayList.find((r) => r.value === form.judgeWay)?.label || '');

  const rules = {
    billUploadType: [{ required: true, message: '请选择账单导入类型', trigger: 'change' }],
    handleType: [{ required: true, message: '请选择需处理类型', trigger: 'change' }],
    billJudgeKey: [{ required: true, message: '请输入判断字段', trigger: 'blur' }],
    judgeWay: [{ required: true, message: '请选择判断方式', trigger: 'change' }],
  };

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
        await billUploadApi.update({ ...data, billUploadId: editId.value });
      } else {
        await billUploadApi.save(data);
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
      uni.setNavigationBarTitle({ title: '编辑上传规则' });
    } else {
      uni.setNavigationBarTitle({ title: '新建上传规则' });
    }
  });
</script>

<style lang="scss" scoped>
  .bill-upload-edit-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: $uni-bg-color-grey;
  }

  .bill-upload-edit-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
  }

  .bill-upload-edit-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70rpx;
    padding: 0 20rpx;
    background-color: #f5f5f5;
    border-radius: 8rpx;
  }

  .bill-upload-edit-select-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
  }
</style>
