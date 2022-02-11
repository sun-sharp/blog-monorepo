<template>
  <n-modal v-model:show="showModal" class="menu-model w-600" :show-icon="false" preset="dialog" :title="modelId ? '修改用户角色' : '新增'">
    <n-form ref="modelFromRef" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="昵称`" path="name">
        <n-input v-model:value="modelForm.name" :disabled="!!modelId" placeholder="请输入昵称" />
      </n-form-item>
      <n-form-item label="头像" path="avatar">
        <app-upload-image
          v-model:value="modelForm.avatar"
          :action="`${uploadUrl}/image`"
          :headers="uploadHeaders"
          :disabled="!!modelId"
          :show-remove-button="!modelId"
          name="files"
          :width="100"
          :height="100"
          :max-number="1"
        />
        <!-- <n-input v-model:value="modelForm.avatar" :disabled="!!modelId" placeholder="请输入头像" /> -->
      </n-form-item>
      <n-form-item label="用户名" path="username">
        <n-input v-model:value="modelForm.username" :disabled="!!modelId" placeholder="请输入用户名" />
      </n-form-item>
      <n-form-item label="角色" path="roleCode">
        <n-select v-model:value="modelForm.roleCode" :options="roleOption" placeholder="请选择角色" />
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
  import { roleApi, userApi } from '@/api';
  import { getAppEnvConfig } from '@/utils/env';
  import { useUserStoreWidthOut } from '@/store/modules/user';
  import AppUploadImage from '@/components/app-upload-image.vue';
  import { getImgUrl } from '@/utils/files/image';

  const modelFields = {
    name: null,
    avatar: [],
    username: null,
    roleCode: null,
  };

  export default defineComponent({
    components: { AppUploadImage },
    emits: ['refurbish'],
    setup(_props, { emit }) {
      const modelId = ref('');
      const showModal = ref(false);

      const formBtnLoading = ref(false);
      const modelFromRef = ref();
      const modelForm = reactive<any>(Object.assign({}, modelFields));
      const modelRules = reactive({
        name: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入角色名称`,
        },
        username: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入用户名`,
        },
        roleCode: {
          required: true,
          trigger: ['blur', 'change'],
          message: `请选择角色标识`,
        },
      });

      // 角色列表
      const roleOption = ref([]);

      // 上传文件
      const appEnvConfig = getAppEnvConfig();
      const { uploadUrl } = appEnvConfig;
      const userStore = useUserStoreWidthOut();
      const token = userStore.getToken;
      const uploadHeaders = reactive({
        timestamp: new Date().getTime(),
        Authorization: token,
      });

      // 初始化
      const init = (row: any) => {
        showModal.value = true;
        modelId.value = row?.userId;
        console.log(row);
        resetFields();
        if (modelId.value) {
          modelForm.name = row.name;
          modelForm.avatar = [getImgUrl(row.avatar)];
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
      const confirmForm = (e) => {
        e.preventDefault();
        formBtnLoading.value = true;
        modelFromRef.value.validate((errors) => {
          if (!errors) {
            const params: any = {
              name: modelForm.name,
            };
            const request = modelId.value ? userApi.updateRoleCode({ userId: modelId.value, roleCode: modelForm.roleCode }) : roleApi.save(params);
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
        uploadUrl,
        uploadHeaders,
        init,
        confirmForm,
      };
    },
  });
</script>

<style lang="scss"></style>
