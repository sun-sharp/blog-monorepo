<template>
  <view class="wechat-edit-page">
    <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <u-form-item label="交易对方备注" prop="tradeOtherPersonRemarks">
        <u-input v-model="form.tradeOtherPersonRemarks" placeholder="请输入交易对方备注" />
      </u-form-item>
      <u-form-item label="流入/流出" prop="inflowOrOutflow">
        <u-select v-model="form.inflowOrOutflow" :list="inflowOrOutflowList" placeholder="请选择" />
      </u-form-item>
      <u-form-item label="说明" prop="explain">
        <u-input v-model="form.explain" placeholder="请输入说明" />
      </u-form-item>
      <u-form-item label="交易场所" prop="place">
        <u-input v-model="form.place" placeholder="请输入交易场所" />
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
  import { weChatApi } from '../../../api';
  import { inflowOrOutflowOption } from '../../../../shared/src/constants/api-type';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');

  const inflowOrOutflowList = inflowOrOutflowOption.map((item) => ({ label: item.label, value: item.value }));

  const form = reactive({
    tradeOtherPersonRemarks: '',
    inflowOrOutflow: 1,
    explain: '',
    place: '',
    billMethod: 0,
    billType: 0,
  });

  const rules = {
    inflowOrOutflow: [{ required: true, message: '请选择流入/流出', trigger: 'change' }],
  };

  async function handleSave() {
    try {
      await formRef.value?.validate();
    } catch {
      return;
    }
    loading.value = true;
    try {
      await weChatApi.update({ ...form, weChatId: editId.value });
      uni.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => uni.navigateBack(), 500);
    } finally {
      loading.value = false;
    }
  }

  onLoad((options) => {
    if (options?.id) {
      editId.value = options.id;
      uni.setNavigationBarTitle({ title: '编辑微信账单' });
    }
  });
</script>

<style lang="scss" scoped>
  .wechat-edit-page {
    padding: 20rpx;
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  }
</style>
