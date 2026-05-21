<template>
  <view class="user-edit-page">
    <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <u-form-item label="昵称" prop="nickname">
        <u-input v-model="form.nickname" placeholder="请输入昵称" :disabled="isEdit" />
      </u-form-item>
      <u-form-item label="用户名" prop="username">
        <u-input v-model="form.username" placeholder="请输入用户名" :disabled="isEdit" />
      </u-form-item>
      <u-form-item label="角色" prop="roleCode">
        <u-select v-model="form.roleCode" :list="roleList" placeholder="请选择角色" />
      </u-form-item>
      <template v-if="!isEdit">
        <u-form-item label="密码" prop="password">
          <u-input v-model="form.password" type="password" placeholder="请输入密码" />
        </u-form-item>
        <u-form-item label="确认密码" prop="verifyPassword">
          <u-input v-model="form.verifyPassword" type="password" placeholder="请再次输入密码" />
        </u-form-item>
      </template>
    </u-form>

    <view class="fixed-bottom-btn">
      <u-button type="primary" :loading="loading" @click="handleSave">保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { userApi, roleApi, capitalApi } from '../../../api';
  import type { ApiUserItem } from '/#/api/capital/user';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');
  const isEdit = ref(false);
  const roleList = ref<{ label: string; value: string }[]>([]);

  const form = reactive({
    nickname: '',
    username: '',
    roleCode: '' as string,
    password: '',
    verifyPassword: '',
  });

  const rules = {
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    roleCode: [{ required: true, message: '请选择角色', trigger: 'change' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    verifyPassword: [{ required: true, message: '请确认密码', trigger: 'blur' }],
  };

  async function loadRoleList() {
    try {
      const res = await roleApi.getAll();
      roleList.value = res.map((r) => ({ label: r.name, value: r.roleCode }));
    } catch (e) {
      console.error(e);
    }
  }

  async function loadUser(userId: string) {
    try {
      const res = await userApi.getPage({ current: 1, size: 1 });
      const user = res.list?.find((u: ApiUserItem) => u.userId === userId);
      if (user) {
        form.nickname = user.nickname;
        form.username = user.username;
        form.roleCode = user.roleCode;
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
    if (!isEdit.value && form.password !== form.verifyPassword) {
      uni.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }
    loading.value = true;
    try {
      if (isEdit.value) {
        await userApi.updateRoleCode({ userId: editId.value, roleCode: form.roleCode });
      } else {
        await capitalApi.signUp({
          nickname: form.nickname,
          username: form.username,
          roleCode: form.roleCode,
          password: form.password,
          avatar: '',
        });
      }
      uni.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => uni.navigateBack(), 500);
    } finally {
      loading.value = false;
    }
  }

  onLoad(async (options) => {
    await loadRoleList();
    if (options?.id) {
      editId.value = options.id;
      isEdit.value = true;
      uni.setNavigationBarTitle({ title: '编辑用户' });
      loadUser(options.id);
    }
  });
</script>

<style lang="scss" scoped>
  .user-edit-page {
    padding: 20rpx;
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  }
</style>
