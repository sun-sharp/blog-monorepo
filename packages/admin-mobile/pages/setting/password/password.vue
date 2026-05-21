<template>
  <view class="password-page">
    <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <u-form-item label="用户名">
        <u-input v-model="form.username" disabled />
      </u-form-item>
      <u-form-item label="当前密码" prop="password">
        <u-input v-model="form.password" type="password" placeholder="请输入当前密码" />
      </u-form-item>
      <u-form-item label="新密码" prop="updatePassword">
        <u-input v-model="form.updatePassword" type="password" placeholder="请输入新密码" />
      </u-form-item>
      <u-form-item label="确认新密码" prop="confirmPassword">
        <u-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码" />
      </u-form-item>
    </u-form>

    <view class="fixed-bottom-btn">
      <u-button type="primary" :loading="loading" @click="handleSave">修改密码</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useUserStore } from '../../../store';
  import { userApi } from '../../../api';

  const userStore = useUserStore();
  const formRef = ref();
  const loading = ref(false);

  const form = reactive({
    username: '',
    password: '',
    updatePassword: '',
    confirmPassword: '',
  });

  const rules = {
    password: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
    updatePassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
    confirmPassword: [{ required: true, message: '请确认新密码', trigger: 'blur' }],
  };

  async function handleSave() {
    try {
      await formRef.value?.validate();
    } catch {
      return;
    }
    if (form.updatePassword !== form.confirmPassword) {
      uni.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }
    loading.value = true;
    try {
      await userApi.updateUserPassword({
        password: form.password,
        updatePassword: form.updatePassword,
      });
      uni.showToast({ title: '修改成功，请重新登录', icon: 'success' });
      setTimeout(() => {
        userStore.logout();
        uni.reLaunch({ url: '/pages/login/login' });
      }, 1000);
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    form.username = userStore.getUserInfo.username;
  });
</script>

<style lang="scss" scoped>
  .password-page {
    padding: 20rpx;
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  }
</style>
