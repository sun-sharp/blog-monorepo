<template>
  <view class="category-edit-page">
    <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <u-form-item label="类型" prop="type">
        <u-select v-model="form.type" :list="categoryTypeList" placeholder="请选择类型" />
      </u-form-item>
      <u-form-item label="标签" prop="label">
        <u-input v-model="form.label" placeholder="请输入标签" />
      </u-form-item>
      <u-form-item label="数值" prop="value">
        <u-number-box v-model="form.value" :min="0" />
      </u-form-item>
      <u-form-item label="字符串值" prop="valueStr">
        <u-input v-model="form.valueStr" placeholder="请输入字符串值" />
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
  import { categoryApi } from '../../../api';
  import { categoryTypeOption } from '../../../../shared/src/constants/api-type';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');

  const categoryTypeList = categoryTypeOption.map((item) => ({ label: item.label, value: item.value }));

  const form = reactive({
    type: '',
    value: 0,
    valueStr: '',
    label: '',
  });

  const rules = {
    type: [{ required: true, message: '请选择类型', trigger: 'change' }],
    label: [{ required: true, message: '请输入标签', trigger: 'blur' }],
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
        await categoryApi.update({ ...data, categoryId: editId.value });
      } else {
        await categoryApi.save(data);
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
      uni.setNavigationBarTitle({ title: '编辑分类' });
    }
  });
</script>

<style lang="scss" scoped>
  .category-edit-page {
    padding: 20rpx;
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  }
</style>
