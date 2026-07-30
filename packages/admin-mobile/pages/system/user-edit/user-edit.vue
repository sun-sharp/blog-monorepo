<template>
  <view class="user-edit-page">
    <scroll-view scroll-y class="user-edit-scroll">
      <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <view class="user-edit-card card">
          <text class="user-edit-section-title">基本信息</text>
          <u-form-item label="昵称" prop="nickname">
            <u-input v-model="form.nickname" placeholder="请输入昵称" :disabled="isEdit" />
          </u-form-item>
          <u-form-item label="用户名" prop="username">
            <u-input v-model="form.username" placeholder="请输入用户名" :disabled="isEdit" />
          </u-form-item>
        </view>

        <view class="user-edit-card card">
          <text class="user-edit-section-title">角色设置</text>
          <u-form-item label="角色" prop="roleCode">
            <view class="user-edit-select" @click="showRoleSelect = true">
              <text :class="form.roleCode ? 'user-edit-select-value' : 'user-edit-select-placeholder'">
                {{ roleLabel || '请选择角色' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#999" />
            </view>
          </u-form-item>
        </view>

        <view v-if="!isEdit" class="user-edit-card card">
          <text class="user-edit-section-title">密码设置</text>
          <u-form-item label="密码" prop="password">
            <u-input v-model="form.password" type="password" placeholder="请输入密码" />
          </u-form-item>
          <u-form-item label="确认密码" prop="verifyPassword">
            <u-input v-model="form.verifyPassword" type="password" placeholder="请再次输入密码" />
          </u-form-item>
        </view>
      </u-form>
    </scroll-view>

    <u-select v-model="showRoleSelect" :list="roleList" title="选择角色" @confirm="onRoleConfirm" />

    <view class="fixed-bottom-btn">
      <u-button type="primary" shape="circle" :loading="loading" @click="handleSave">保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { userApi, roleApi, capitalApi } from '../../../api';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');
  const isEdit = ref(false);
  const showRoleSelect = ref(false);
  const roleList = ref<{ label: string; value: string }[]>([]);

  const form = reactive({
    nickname: '',
    username: '',
    roleCode: '' as string,
    password: '',
    verifyPassword: '',
  });

  const roleLabel = computed(() => {
    const item = roleList.value.find((r) => r.value === form.roleCode);
    return item?.label || '';
  });

  const rules = {
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    roleCode: [{ required: true, message: '请选择角色', trigger: 'change' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    verifyPassword: [{ required: true, message: '请确认密码', trigger: 'blur' }],
  };

  function onRoleConfirm(e: any) {
    form.roleCode = e[0]?.value ?? '';
  }

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
      const user = await userApi.getOne(userId);
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
    } else {
      uni.setNavigationBarTitle({ title: '新建用户' });
    }
  });
</script>

<style lang="scss" scoped>
  .user-edit-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: $uni-bg-color-grey;
  }

  .user-edit-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
  }

  .user-edit-card {
    padding: 30rpx;
    margin-bottom: 20rpx;
  }

  .user-edit-section-title {
    font-size: $uni-font-size-lg;
    font-weight: 600;
    color: $uni-text-color;
    display: block;
    margin-bottom: 20rpx;
  }

  .user-edit-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70rpx;
    padding: 0 20rpx;
    background-color: #f5f5f5;
    border-radius: 8rpx;
  }

  .user-edit-select-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
  }

  .user-edit-select-placeholder {
    font-size: $uni-font-size-base;
    color: $uni-text-color-placeholder;
  }
</style>
