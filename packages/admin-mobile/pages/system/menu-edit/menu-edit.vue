<template>
  <view class="menu-edit-page">
    <u-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <u-form-item label="菜单标题" prop="title">
        <u-input v-model="form.title" placeholder="请输入菜单标题" />
      </u-form-item>
      <u-form-item label="菜单标识" prop="name">
        <u-input v-model="form.name" placeholder="请输入菜单标识" />
      </u-form-item>
      <u-form-item label="菜单类型" prop="menuType">
        <u-select v-model="form.menuType" :list="menuTypeList" placeholder="请选择菜单类型" />
      </u-form-item>
      <u-form-item label="排序" prop="sort">
        <u-number-box v-model="form.sort" :min="0" />
      </u-form-item>
      <u-form-item label="组件路径" prop="component">
        <u-input v-model="form.component" placeholder="请输入组件路径" />
      </u-form-item>
      <u-form-item label="图标" prop="icon">
        <u-input v-model="form.icon" placeholder="请输入图标名称" />
      </u-form-item>
      <u-form-item label="内嵌地址" prop="iframeSrc">
        <u-input v-model="form.iframeSrc" placeholder="请输入内嵌地址" />
      </u-form-item>
      <u-form-item label="隐藏" prop="hidden">
        <u-switch v-model="form.hidden" />
      </u-form-item>
      <u-form-item label="缓存" prop="keepAlive">
        <u-switch v-model="form.keepAlive" />
      </u-form-item>
    </u-form>

    <view class="fixed-bottom-btn">
      <u-button type="primary" :loading="loading" @click="handleSave">保存</u-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { menuApi } from '../../../api';
  import { menuTypeOption } from '../../../../shared/src/constants/api-type';

  const formRef = ref();
  const loading = ref(false);
  const editId = ref('');

  const menuTypeList = menuTypeOption.map((item) => ({ label: item.label, value: item.value }));

  const form = reactive({
    title: '',
    name: '',
    parentId: '0',
    menuType: 5,
    hidden: false,
    component: '',
    sort: 0,
    icon: '',
    iframeSrc: '',
    externalLink: '',
    keepAlive: false,
  });

  const rules = {
    title: [{ required: true, message: '请输入菜单标题', trigger: 'blur' }],
    name: [{ required: true, message: '请输入菜单标识', trigger: 'blur' }],
    menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  };

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
        await menuApi.updateMenu({ ...data, menuId: editId.value });
      } else {
        await menuApi.saveMenu(data);
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
      uni.setNavigationBarTitle({ title: '编辑菜单' });
    }
  });
</script>

<style lang="scss" scoped>
  .menu-edit-page {
    padding: 20rpx;
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  }
</style>
