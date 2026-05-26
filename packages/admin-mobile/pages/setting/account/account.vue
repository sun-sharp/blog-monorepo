<template>
  <view class="account-page">
    <scroll-view scroll-y class="account-scroll">
      <u-form ref="formRef" :model="form" :rules="rules" label-width="180" class="account-form">
        <u-form-item label="头像">
          <view class="avatar-wrapper">
            <u-avatar :src="getImgUrl(form.avatar) || '/static/logo.png'" size="80" @click="chooseAvatar" />
          </view>
        </u-form-item>
        <u-form-item label="昵称" prop="nickname">
          <u-input v-model="form.nickname" placeholder="请输入昵称" border />
        </u-form-item>
        <u-form-item label="用户名" prop="username">
          <u-input v-model="form.username" placeholder="请输入用户名" border />
        </u-form-item>
      </u-form>
    </scroll-view>

    <view class="fixed-bottom-btn">
      <u-button type="primary" :loading="loading" @click="handleSave">保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useUserStore } from '../../../store';
  import { userApi } from '../../../api';
  import { getImgUrl } from '../../../../shared/src/utils/files';

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
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: $uni-bg-color-grey;
  }

  .account-scroll {
    flex: 1;
    width: 100%;
    height: 0;
    padding: 20rpx;
    box-sizing: border-box;
  }

  .account-form {
    background-color: $uni-bg-color;
    border-radius: 12rpx;
    padding: 20rpx;
  }

  .avatar-wrapper {
    width: 100%;
    display: flex;
    justify-content: right;
  }
</style>
