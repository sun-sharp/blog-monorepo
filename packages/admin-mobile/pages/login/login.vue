<template>
  <view class="login-page">
    <view class="login-header">
      <image class="login-logo" src="/static/logo.png" mode="aspectFit" />
      <text class="login-title">{{ appTitle }}</text>
    </view>
    <view class="login-form">
      <u-form ref="formRef" :model="form" :rules="rules">
        <u-form-item prop="username">
          <u-input v-model="form.username" placeholder="请输入用户名" prefix-icon="account" :prefix-icon-style="{ color: '#999' }" />
        </u-form-item>
        <u-form-item prop="password">
          <u-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="lock" :prefix-icon-style="{ color: '#999' }" />
        </u-form-item>
      </u-form>
      <u-button type="primary" :loading="loading" class="login-btn" @click="handleLogin">登录</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useUserStore } from '../../store';

  const appTitle = import.meta.env.VITE_APP_TITLE || '管理后台';
  const userStore = useUserStore();
  const formRef = ref();
  const loading = ref(false);

  const form = reactive({
    username: '',
    password: '',
  });

  const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  };

  async function handleLogin() {
    try {
      await formRef.value?.validate();
    } catch {
      return;
    }
    loading.value = true;
    try {
      const res = await userStore.login(form);
      if (res.code === 0) {
        uni.showToast({ title: '登录成功', icon: 'success' });
        uni.reLaunch({ url: '/pages/home/home' });
      } else {
        uni.showToast({ title: res.message || '登录失败', icon: 'none' });
      }
    } finally {
      loading.value = false;
    }
  }
</script>

<style lang="scss" scoped>
  .login-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60rpx;
    background-color: $uni-bg-color;
  }

  .login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 80rpx;
  }

  .login-logo {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: 30rpx;
  }

  .login-title {
    font-size: 40rpx;
    font-weight: bold;
    color: $uni-text-color;
  }

  .login-form {
    width: 100%;
  }

  .login-btn {
    margin-top: 40rpx;
  }
</style>
