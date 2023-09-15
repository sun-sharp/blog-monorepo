<script lang="ts" setup>
  import { FormItemRule } from 'naive-ui';
  import { onMounted, reactive, ref } from 'vue';
  import { userApi } from '@/api';
  import { useUserStore } from '@/store';

  const modelFromRef: any = ref(null);
  // const message = useMessage();

  // 获取基本信息
  const userStore = useUserStore();
  const userInfo: any = userStore.getUserInfo;

  // 表单权限
  // 判断正在输入的密码是否输入
  const validatePasswordStartWith = (_rule: FormItemRule, value: string) =>
    modelForm.updatePassword && modelForm.updatePassword.startsWith(value) && modelForm.updatePassword.length >= value.length;
  // 判断输入完成的密码是否完全相同
  const validatePasswordSame = (_rule: FormItemRule, value: string) => value === modelForm.updatePassword;
  const modelRules = {
    password: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入密码`,
    },
    updatePassword: {
      required: true,
      trigger: ['blur', 'input'],
      message: `请输入密码`,
    },
    confirmPassword: [
      {
        required: true,
        message: '请再次输入密码',
        trigger: ['input', 'blur'],
      },
      {
        validator: validatePasswordStartWith,
        message: '两次密码输入不一致',
        trigger: 'input',
      },
      {
        validator: validatePasswordSame,
        message: '两次密码输入不一致',
        trigger: ['blur', 'password-input'],
      },
    ],
  };

  const modelFields = {
    username: '',
    password: '',
    updatePassword: '',
    confirmPassword: '',
  };

  // 表单字段
  const modelForm = reactive<any>(Object.assign({}, modelFields));

  // 初始化
  const init = () => {
    Object.assign(modelForm, modelFields);
    modelForm.username = userInfo.username;
  };

  // 表单提交
  const formLoading = ref(false);
  const formSubmit = () => {
    modelFromRef.value.validate((errors: FormItemRule) => {
      if (!errors) {
        formLoading.value = true;
        const parameters = {
          password: modelForm.password,
          updatePassword: modelForm.updatePassword,
        };
        userApi.updateUserPassword(parameters).finally(() => {
          formLoading.value = false;
        });
      }
    });
  };

  onMounted(init);
</script>

<template>
  <n-card :bordered="false">
    <n-form ref="modelFromRef" label-placement="left" label-align="right" :label-width="80" :model="modelForm" :rules="modelRules">
      <n-form-item label="账号名">
        <n-input v-model:value="modelForm.username" disabled placeholder="请输入账号名" />
      </n-form-item>
      <n-form-item label="密码" path="password">
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
      <n-form-item label="修改密码" path="updatePassword">
        <n-input
          v-model:value="modelForm.updatePassword"
          :input-props="{
            autocomplete: 'new-password',
          }"
          type="password"
          show-password-on="click"
          placeholder="请输入密码"
        />
      </n-form-item>
      <n-form-item label="确认密码" path="confirmPassword">
        <n-input
          v-model:value="modelForm.confirmPassword"
          :disabled="!modelForm.updatePassword"
          type="password"
          show-password-on="click"
          placeholder="请再次输入密码"
        />
      </n-form-item>
      <div>
        <n-space>
          <n-button type="primary" :loading="formLoading" @click="formSubmit">修改密码</n-button>
        </n-space>
      </div>
    </n-form>
  </n-card>
</template>
