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

<script lang="ts">
  import { defineComponent, nextTick, reactive, ref } from 'vue';
  import { roleApi, userApi, capitalApi } from '@/api';
  import FormUploadImage from '@/components/form/form-upload-image.vue';
  import { getImgUrl } from '@/utils';
  import { FormItemRule } from 'naive-ui';

  const modelFields = {
    nickname: null,
    avatar: [],
    username: null,
    roleCode: null,
    password: null,
    verifyPassword: null,
  };

  export default defineComponent({
    components: { FormUploadImage },
    emits: ['refurbish'],
    setup(_props, { emit }) {
      const modelId = ref('');
      const showModal = ref(false);

      const formBtnLoading = ref(false);
      const modelFromRef = ref();
      const modelForm = reactive<any>(Object.assign({}, modelFields));
      // 验证用户名
      const validateUsername = (_rule: FormItemRule, value: string) => {
        if (!value) return new Error('请输入用户名');
        else if (!/^[a-z][a-z_`~@*|()+-]{3,40}$/.test(value)) return new Error('用户名不符合规定');
        return true;
      };
      // 判断正在输入的密码是否输入
      const validatePasswordStartWith = (_rule: FormItemRule, value: string) =>
        modelForm.password && modelForm.password.startsWith(value) && modelForm.password.length >= value.length;
      // 判断输入完成的密码是否完全相同
      const validatePasswordSame = (_rule: FormItemRule, value: string) => value === modelForm.password;
      const modelRules = reactive({
        nickname: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入角色昵称`,
        },
        username: {
          required: true,
          validator: validateUsername,
          trigger: ['blur', 'input'],
        },
        roleCode: {
          required: true,
          trigger: ['blur', 'change'],
          message: `请选择角色标识`,
        },
        password: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入密码`,
        },
        verifyPassword: [
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
      });

      // 角色列表
      const roleOption = ref([]);

      // 初始化
      const init = (row: any) => {
        showModal.value = true;
        modelId.value = row?.userId;
        resetFields();
        if (modelId.value) {
          modelForm.nickname = row.nickname;
          modelForm.avatar = row.avatar
            ? [
                {
                  url: getImgUrl(row.avatar),
                  key: row.avatar,
                  status: 'finished',
                },
              ]
            : [];
          modelForm.username = row.username;
          modelForm.roleCode = row.roleCode;
        }
        nextTick(() => {
          roleApi.getAll().then((res) => {
            roleOption.value = res.map((m: any) => ({ label: m.name, value: m.roleCode }));
          });
        });
      };
      // 重置
      const resetFields = () => {
        Object.keys(modelFields).forEach((key) => {
          modelForm[key] = modelFields[key];
        });
        nextTick(() => {
          modelFromRef.value.restoreValidation();
        });
      };

      // 提交
      const confirmForm = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        formBtnLoading.value = true;
        modelFromRef.value.validate((errors) => {
          if (!errors) {
            const request = modelId.value
              ? userApi.updateRoleCode({ userId: modelId.value, roleCode: modelForm.roleCode })
              : capitalApi.signUp({
                  nickname: modelForm.nickname,
                  avatar: modelForm.avatar.length > 0 ? modelForm.avatar[0].key : '',
                  username: modelForm.username,
                  roleCode: modelForm.roleCode,
                  password: modelForm.verifyPassword,
                });
            request.then(() => {
              showModal.value = false;
              emit('refurbish');
            });
          }
          formBtnLoading.value = false;
        });
      };

      return {
        modelId,
        showModal,
        modelFromRef,
        modelForm,
        modelRules,
        formBtnLoading,
        roleOption,
        init,
        confirmForm,
      };
    },
  });
</script>

<style lang="scss"></style>
