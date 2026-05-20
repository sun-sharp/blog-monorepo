<template>
  <view class="login-page">
    <view class="login-header">
      <text class="login-title">{{ APP_ENV_CONFIG.title }}</text>
      <text class="login-subtitle">移动端管理系统</text>
    </view>

    <view class="login-form">
      <u-form :model="formData" :rules="rules" ref="formRef">
        <u-form-item prop="username">
          <u-input v-model="formData.username" placeholder="请输入用户名" prefixIcon="account" border="surround" />
        </u-form-item>
        <u-form-item prop="password">
          <u-input v-model="formData.password" type="password" placeholder="请输入密码" prefixIcon="lock" border="surround" />
        </u-form-item>
      </u-form>

      <u-button type="primary" :loading="loading" @click="handleLogin" text="登 录" customStyle="margin-top: 40rpx" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useUserStore } from '@/store';
import { APP_ENV_CONFIG } from '@/constant';

const userStore = useUserStore();
const loading = ref(false);
const formRef = ref();

const formData = reactive({
  username: '',
  password: '',
});

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const handleLogin = async () => {
  try {
    loading.value = true;
    await userStore.login({ username: formData.username, password: formData.password });
    uni.switchTab({ url: '/pages/home/index' });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60rpx;
  background: linear-gradient(135deg, #018d71 0%, #0a6b5a 100%);
}

.login-header {
  text-align: center;
  margin-bottom: 80rpx;
}

.login-title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 16rpx;
}

.login-subtitle {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.login-form {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 48rpx 32rpx;
}
</style>
