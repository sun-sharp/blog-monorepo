<template>
  <n-card :bordered="false">
    <n-form ref="modelFromRef" label-placement="left" label-align="left" :label-width="80" :model="modelForm" :rules="modelRules">
      <n-form-item label="昵称" path="nickname">
        <n-input v-model:value="modelForm.nickname" placeholder="请输入昵称" />
      </n-form-item>
      <n-form-item label="账号名" path="username">
        <n-input v-model:value="modelForm.username" placeholder="请输入账号名" />
      </n-form-item>
      <n-form-item label="头像" path="avatar">
        <!-- <form-upload-image v-if="hasUploadImage" v-model:imageList="modelForm.avatar" :max="1" source="user_avatar" /> -->
      </n-form-item>
      <div>
        <n-space>
          <n-button type="primary" :loading="formLoading" @click="formSubmit">更新基本信息</n-button>
        </n-space>
      </div>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
  import { FormItemRule, useMessage } from 'naive-ui';
  import { onMounted, reactive, ref } from 'vue';
  // import FormUploadImage from '@/components/form/form-upload-image.vue';
  import { useUserStore } from '@/store';
  import { getImgUrl } from '@/utils';
  import { userApi } from '@/api';
  import { UserUpdateUserInfoForm } from '/#/api/user';

  const modelFromRef = ref();
  const message = useMessage();

  // 表单权限
  const modelRules = {
    nickname: {
      required: true,
      message: '请输入昵称',
      trigger: 'blur',
    },
    username: {
      required: true,
      message: '请输入账号名',
      trigger: 'blur',
    },
  };

  const modelFields = {
    nickname: '',
    avatar: [],
    username: '',
  };

  // 表单字段
  const modelForm = reactive<UserUpdateUserInfoForm>(Object.assign({}, modelFields));

  // 获取基本信息
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;

  const hasUploadImage = ref(false);

  // 初始化
  const init = () => {
    modelForm.nickname = userInfo.nickname;
    modelForm.username = userInfo.username;
    modelForm.avatar = userInfo.avatar
      ? [
          {
            url: getImgUrl(userInfo.avatar),
            key: userInfo.avatar,
            status: 'finished',
          },
        ]
      : [];
    hasUploadImage.value = true;
  };

  // 表单提交
  const formLoading = ref(false);
  const formSubmit = () => {
    modelFromRef.value.validate((errors: FormItemRule) => {
      if (!errors) {
        formLoading.value = true;
        const avatar = modelForm.avatar.length > 0 ? modelForm.avatar[0].key : '';
        userApi
          .updateUserInfo({ ...modelForm, avatar })
          .then(() => {
            userStore.setUserInfo({ ...userInfo, avatar });
            message.success('更改成功');
          })
          .finally(() => {
            formLoading.value = false;
          });
      }
    });
  };

  onMounted(init);
</script>
