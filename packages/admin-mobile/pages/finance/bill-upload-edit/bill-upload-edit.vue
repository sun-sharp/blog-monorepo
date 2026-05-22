<template>
  <view class="bill-upload-edit-page">
    <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <u-form-item label="账单导入类型" prop="billUploadType">
        <u-select v-model="form.billUploadType" :list="billUploadTypeList" placeholder="请选择" />
      </u-form-item>
      <u-form-item label="需处理类型" prop="handleType">
        <u-select v-model="form.handleType" :list="handleTypeList" placeholder="请选择" />
      </u-form-item>
      <u-form-item label="流入/流出">
        <u-select v-model="form.inflowOrOutflow" :list="inflowOrOutflowList" placeholder="请选择" />
      </u-form-item>
      <u-form-item label="判断字段" prop="billJudgeKey">
        <u-input v-model="form.billJudgeKey" placeholder="请输入判断字段" />
      </u-form-item>
      <u-form-item label="判断方式" prop="judgeWay">
        <u-select v-model="form.judgeWay" :list="judgeWayList" placeholder="请选择" />
      </u-form-item>
    </u-form>

    <view class="fixed-bottom-btn">
      <u-button type="primary" :loading="loading" @click="handleSave">保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { billUploadApi } from '../../../api';
  import { billUploadTypeOption, handleTypeOption, inflowOrOutflowOption, judgeWayOption } from '../../../../shared/src/constants/api-type';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');

  const billUploadTypeList = billUploadTypeOption.map((item) => ({ label: item.label, value: item.value }));
  const handleTypeList = handleTypeOption.map((item) => ({ label: item.label, value: item.value }));
  const inflowOrOutflowList = [{ label: '不限', value: 0 }, ...inflowOrOutflowOption.map((item) => ({ label: item.label, value: item.value }))];
  const judgeWayList = judgeWayOption.map((item) => ({ label: item.label, value: item.value }));

  const form = reactive({
    billUploadType: 1,
    billJudgeKey: '',
    handleType: '',
    inflowOrOutflow: 0,
    billType: 0,
    billMethod: 0,
    priorityWeight: 0,
    judgeWay: 'indexOf',
    judgeVal: [] as string[],
  });

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
    }
  });
</script>

<style lang="scss" scoped>
  .bill-upload-edit-page {
    padding: 20rpx;
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  }
</style>
