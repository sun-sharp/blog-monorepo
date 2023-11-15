<script lang="ts" setup>
  import FormUploadImage from '@/components/form/FormUploadImage.vue';
  import { useUserAddUpdateModel } from '../hooks/useUserAddUpdateModel';

  const emit = defineEmits(['refresh']);

  const { modelId, showModal, modelFromRef, modelForm, modelRules, formBtnLoading, roleOption, init, confirmForm } = useUserAddUpdateModel(emit);

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" :mask-closable="false" preset="dialog" :title="modelId ? '修改用户角色' : '新增'">
    <n-form ref="modelFromRef" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="昵称`" path="nickname">
        <n-input v-model:value="modelForm.nickname" :disabled="!!modelId" placeholder="请输入昵称" />
      </n-form-item>
      <n-form-item label="头像" path="avatar">
        <form-upload-image v-model:imageList="modelForm.avatar" :disabled="!!modelId" :max="1" source="user_avatar" />
      </n-form-item>
      <n-form-item label="用户名" path="username">
        <n-input v-model:value="modelForm.username" :disabled="!!modelId" placeholder="请输入用户名" />
      </n-form-item>
      <n-form-item label="角色" path="roleCode">
        <n-select v-model:value="modelForm.roleCode" :options="roleOption" placeholder="请选择角色" />
      </n-form-item>
      <n-form-item v-if="!modelId" label="密码" path="password">
        <n-input
          v-model:value="modelForm.password"
          :input-props="{
            autocomplete: 'new-password',
          }"
          type="password"
          show-password-on="click"
          placeholder="请输入密码"
        />
      </n-form-item>
      <n-form-item v-if="!modelId" label="确认密码" path="verifyPassword">
        <n-input
          v-model:value="modelForm.verifyPassword"
          :disabled="!modelForm.password"
          type="password"
          show-password-on="click"
          placeholder="请再次输入密码"
        />
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
