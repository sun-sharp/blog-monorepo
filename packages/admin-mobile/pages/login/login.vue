<template>
  <view class="login-page">
    <view class="login-bg" />
    <scroll-view scroll-y class="login-scroll">
      <view class="login-content" :style="{ paddingTop: `calc(${customNavHeight}px + 100rpx)` }">
        <view class="login-header">
          <view class="login-logo-wrap">
            <image class="login-logo" src="/static/logo.png" mode="aspectFit" />
          </view>
          <text class="login-title">{{ appTitle }}</text>
          <text class="login-subtitle">欢迎回来，请登录你的账号</text>
        </view>
        <view class="login-form card">
          <u-form ref="formRef" :model="form" :rules="rules">
            <u-form-item prop="username">
              <u-input v-model="form.username" placeholder="请输入用户名" prefix-icon="account" :prefix-icon-style="{ color: '#999' }" shape="round" :cursor-spacing="20" />
            </u-form-item>
            <u-form-item prop="password">
              <u-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                prefix-icon="lock"
                :prefix-icon-style="{ color: '#999' }"
                shape="round"
                :cursor-spacing="20" />
            </u-form-item>
          </u-form>
          <u-button type="primary" :loading="loading" shape="circle" class="login-btn" @click="handleLogin">登 录</u-button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useUserStore } from '../../store';
  import { getCustomNavHeight } from '../../utils/custom-nav';

  const customNavHeight = getCustomNavHeight();
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
        uni.reLaunch({ url: '/pages/main/main' });
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
    position: relative;
    height: 100vh;
  }

  .login-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60vh;
    background: linear-gradient(135deg, #667eea, #007aff);
    border-radius: 0 0 60rpx 60rpx;
  }

  .login-scroll {
    position: relative;
    z-index: 1;
    height: 100%;
  }

  .login-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 60rpx;
    padding-right: 60rpx;
    padding-bottom: 0;
  }

  .login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60rpx;
  }

  .login-logo-wrap {
    width: 140rpx;
    height: 140rpx;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20rpx;
  }

  .login-logo {
    width: 100rpx;
    height: 100rpx;
  }

  .login-title {
    font-size: 44rpx;
    font-weight: bold;
    color: #fff;
    margin-top: 24rpx;
  }

  .login-subtitle {
    font-size: $uni-font-size-base;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 12rpx;
  }

  .login-form {
    width: 100%;
    padding: 40rpx;
  }

  .login-btn {
    margin-top: 40rpx;
  }
</style>
