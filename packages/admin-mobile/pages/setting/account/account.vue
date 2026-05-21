<template>
  <view class="account-page">
    <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <u-form-item label="头像">
        <u-avatar :src="form.avatar || '/static/logo.png'" size="80" @click="chooseAvatar" />
      </u-form-item>
      <u-form-item label="昵称" prop="nickname">
        <u-input v-model="form.nickname" placeholder="请输入昵称" />
      </u-form-item>
      <u-form-item label="用户名" prop="username">
        <u-input v-model="form.username" placeholder="请输入用户名" />
      </u-form-item>
    </u-form>

    <view class="fixed-bottom-btn">
      <u-button type="primary" :loading="loading" @click="handleSave">保存</u-button>
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
    nickname: '',
    username: '',
    avatar: '',
  });

  const rules = {
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  };

  function chooseAvatar() {
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: (res) => {
        form.avatar = res.tempFilePaths[0];
      },
    });
  }

  async function handleSave() {
    try {
      await formRef.value?.validate();
    } catch {
      return;
    }
    loading.value = true;
    try {
      await userApi.updateUserInfo({
        nickname: form.nickname,
        username: form.username,
        avatar: form.avatar,
      });
      await userStore.GetInfo();
      uni.showToast({ title: '保存成功', icon: 'success' });
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    const info = userStore.getUserInfo;
    form.nickname = info.nickname;
    form.username = info.username;
    form.avatar = info.avatar;
  });
</script>

<style lang="scss" scoped>
  .account-page {
    padding: 20rpx;
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  }
</style>
