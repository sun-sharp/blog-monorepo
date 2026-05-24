<template>
  <view class="role-edit-page">
    <scroll-view scroll-y class="role-edit-scroll">
      <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <view class="role-edit-card card">
          <text class="role-edit-section-title">角色信息</text>
          <u-form-item label="角色名称" prop="name">
            <u-input v-model="form.name" placeholder="请输入角色名称" />
          </u-form-item>
          <u-form-item label="角色编码" prop="roleCode">
            <u-input v-model="form.roleCode" placeholder="请输入角色编码" />
          </u-form-item>
          <u-form-item label="角色类型" prop="roleType">
            <view class="role-edit-select" @click="showRoleTypeSelect = true">
              <text :class="form.roleType ? 'role-edit-select-value' : 'role-edit-select-placeholder'">
                {{ roleTypeLabel || '请选择角色类型' }}
              </text>
              <u-icon name="arrow-right" size="28" color="#999" />
            </view>
          </u-form-item>
        </view>
      </u-form>
    </scroll-view>

    <u-select v-model="showRoleTypeSelect" :list="roleTypeList" title="选择角色类型" @confirm="onRoleTypeConfirm" />

    <view class="fixed-bottom-btn">
      <u-button type="primary" shape="circle" :loading="loading" @click="handleSave">保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { roleApi } from '../../../api';
  import { roleTypeOption } from '../../../../shared/src/constants/api-type';
  import type { ApiRoleItem } from '/#/api/capital/role';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');
  const showRoleTypeSelect = ref(false);

  const roleTypeList = roleTypeOption.map((item) => ({ label: item.label, value: item.value }));

  const form = reactive({
    name: '',
    roleCode: '',
    roleType: 0 as number,
    menuPermission: [] as string[],
    apiPermission: [] as string[],
  });

  const roleTypeLabel = computed(() => {
    const item = roleTypeList.find((r) => r.value === form.roleType);
    return item?.label || '';
  });

  const rules = {
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
    roleType: [{ required: true, message: '请选择角色类型', trigger: 'change' }],
  };

  function onRoleTypeConfirm(e: any) {
    form.roleType = e[0]?.value ?? 0;
  }

  async function loadRole(roleId: string) {
    try {
      const res = await roleApi.getPage({ current: 1, size: 1 });
      const role = res.list?.find((r: ApiRoleItem) => r.roleId === roleId);
      if (role) {
        form.name = role.name;
        form.roleCode = role.roleCode;
        form.roleType = role.roleType;
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
      loadRole(options.id);
    } else {
      uni.setNavigationBarTitle({ title: '新建角色' });
    }
  });
</script>

<style lang="scss" scoped>
  .role-edit-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: $uni-bg-color-grey;
  }

  .role-edit-scroll {
    flex: 1;
    height: 0;
    padding: 20rpx;
  }

  .role-edit-card {
    padding: 30rpx;
    margin-bottom: 20rpx;
  }

  .role-edit-section-title {
    font-size: $uni-font-size-lg;
    font-weight: 600;
    color: $uni-text-color;
    display: block;
    margin-bottom: 20rpx;
  }

  .role-edit-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70rpx;
    padding: 0 20rpx;
    background-color: #f5f5f5;
    border-radius: 8rpx;
  }

  .role-edit-select-value {
    font-size: $uni-font-size-base;
    color: $uni-text-color;
  }

  .role-edit-select-placeholder {
    font-size: $uni-font-size-base;
    color: $uni-text-color-placeholder;
  }
</style>
