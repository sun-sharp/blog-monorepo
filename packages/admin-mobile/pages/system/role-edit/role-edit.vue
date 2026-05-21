<template>
  <view class="role-edit-page">
    <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <u-form-item label="角色名称" prop="name">
        <u-input v-model="form.name" placeholder="请输入角色名称" />
      </u-form-item>
      <u-form-item label="角色编码" prop="roleCode">
        <u-input v-model="form.roleCode" placeholder="请输入角色编码" />
      </u-form-item>
      <u-form-item label="角色类型" prop="roleType">
        <u-select v-model="form.roleType" :list="roleTypeList" placeholder="请选择角色类型" />
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
  import { roleApi } from '../../../api';
  import { roleTypeOption } from '../../../../shared/src/constants/api-type';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');

  const roleTypeList = roleTypeOption.map((item) => ({ label: item.label, value: item.value }));

  const form = reactive({
    name: '',
    roleCode: '',
    roleType: 1,
    menuPermission: [] as string[],
    apiPermission: [] as string[],
  });

  const rules = {
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
    roleType: [{ required: true, message: '请选择角色类型', trigger: 'change' }],
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
        await roleApi.update({ ...data, roleId: editId.value });
      } else {
        await roleApi.save(data);
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
      uni.setNavigationBarTitle({ title: '编辑角色' });
    }
  });
</script>

<style lang="scss" scoped>
  .role-edit-page {
    padding: 20rpx;
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  }
</style>
