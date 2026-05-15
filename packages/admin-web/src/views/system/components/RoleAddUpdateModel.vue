<script lang="ts" setup>
  import { roleTypeOption } from '@/constant';
  import { useRoleAddUpdateModel } from '../hooks/useRoleAddUpdateModel';

  const emit = defineEmits(['refresh']);

  const {
    modelId,
    showModal,
    modelFromRef,
    modelForm,
    modelRules,
    formBtnLoading,
    menuData,
    defaultMenuChecked,
    menuListLoading,
    defaultApiChecked,
    apiAllLoading,
    apiAllData,
    init,
    updateMenuChecked,
    updateApiChecked,
    confirmForm,
  } = useRoleAddUpdateModel(emit);

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" preset="dialog" :title="modelId ? '修改' : '新增'">
    <n-form ref="modelFromRef" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="角色名称`" path="name">
        <n-input v-model:value="modelForm.name" placeholder="请输入角色名称" />
      </n-form-item>
      <n-form-item label="角色标识" path="roleCode">
        <n-input v-model:value="modelForm.roleCode" placeholder="请输入角色标识" />
      </n-form-item>
      <n-form-item label="角色权限类型" path="roleType">
        <n-select v-model:value="modelForm.roleType" :options="roleTypeOption" placeholder="请选择角色权限类型" />
      </n-form-item>
      <n-form-item v-if="modelForm.roleType === 2 && menuListLoading" label="菜单权限" path="menuPermission">
        <n-tree
          style="width: 100%"
          block-line
          block-node
          cascade
          checkable
          key-field="name"
          label-field="title"
          :data="menuData"
          :default-expand-all="false"
          :default-checked-keys="defaultMenuChecked"
          @update:checked-keys="updateMenuChecked" />
      </n-form-item>
      <n-form-item v-if="modelForm.roleType === 2 && apiAllLoading" label="接口权限" path="apiPermission">
        <n-tree
          style="width: 100%"
          block-line
          block-node
          cascade
          checkable
          :data="apiAllData"
          :default-expand-all="false"
          :default-checked-keys="defaultApiChecked"
          @update:checked-keys="updateApiChecked" />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" :disabled="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style lang="scss"></style>
