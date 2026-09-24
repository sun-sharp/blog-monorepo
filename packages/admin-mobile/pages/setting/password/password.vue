<template>
  <u-config-provider :dark-mode="mode">
    <view class="password-page" :class="{ dark: isDark }">
      <scroll-view scroll-y class="password-scroll">
        <u-form ref="formRef" :model="form" :rules="rules" label-position="top" class="password-form" :class="{ dark: isDark }">
          <u-form-item label="用户名">
            <u-input v-model="form.username" disabled border />
          </u-form-item>
          <u-form-item label="当前密码" prop="password">
            <u-input v-model="form.password" type="password" placeholder="请输入当前密码" border :cursor-spacing="20" />
          </u-form-item>
          <u-form-item label="新密码" prop="updatePassword">
            <u-input v-model="form.updatePassword" type="password" placeholder="请输入新密码" border :cursor-spacing="20" />
          </u-form-item>
          <u-form-item label="确认新密码" prop="confirmPassword">
            <u-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码" border :cursor-spacing="20" />
          </u-form-item>
        </u-form>
      </scroll-view>

      <view class="fixed-bottom-btn" :class="{ dark: isDark }">
        <u-button type="primary" :loading="loading" @click="handleSave">修改密码</u-button>
      </view>
    </view>
  </u-config-provider>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useUserStore } from '../../../store';
  import { userApi } from '../../../api';
  import { useAppTheme } from '../../../composables/useAppTheme';

  const { isDark, mode } = useAppTheme();

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
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: $uni-bg-color-grey;

    &.dark {
      background-color: $dark-page-bg;
    }
  }

  .password-scroll {
    flex: 1;
    width: 100%;
    height: 0;
    padding: 20rpx;
    box-sizing: border-box;
  }

  .password-form {
    background-color: $uni-bg-color;
    border-radius: 12rpx;
    padding: 20rpx;

    &.dark {
      background-color: $dark-card-bg;
    }
  }
</style>
