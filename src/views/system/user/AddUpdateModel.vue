<template>
  <n-modal v-model:show="showModal" class="menu-model w-600" :show-icon="false" preset="dialog" :title="modelId ? '修改' : '新增'">
    <n-form ref="modelFromRef" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="昵称`" path="name">
        <n-input v-model:value="modelForm.name" placeholder="请输入昵称" />
      </n-form-item>
      <n-form-item label="头像" path="avatar">
        <n-input v-model:value="modelForm.avatar" placeholder="请输入头像" />
      </n-form-item>
      <n-form-item label="用户名" path="username">
        <n-input v-model:value="modelForm.username" placeholder="请输入用户名" />
      </n-form-item>
      <n-form-item label="角色" path="roleCode">
        <n-select v-model:value="modelForm.roleCode" :options="roleOption" placeholder="请选择角色" />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" :disabled="true" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts">
  import { defineComponent, nextTick, reactive, ref } from 'vue';
  import { roleApi } from '@/api';

  const modelFields = {
    name: null,
    avatar: null,
    username: null,
    roleCode: null,
  };

  export default defineComponent({
    emits: ['refurbish'],
    setup(_props, { emit }) {
      const modelId = ref('');
      const showModal = ref(false);

      const formBtnLoading = ref(false);
      const modelFromRef = ref();
      const modelForm = reactive(Object.assign({}, modelFields));
      const roleOption = ref([]);
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

      // 初始化
      const init = (row) => {
        showModal.value = true;
        modelId.value = row?.userId;
        resetFields();
        if (modelId.value) {
          modelForm.name = row.name;
          modelForm.avatar = row.avatar;
          modelForm.username = row.username;
          modelForm.roleCode = row.roleCode;
        }
        nextTick(() => {
          roleApi.getAll().then((res) => {
            roleOption.value = res.map((m) => ({ label: m.name, value: m.roleCode }));
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
            const request = modelId.value ? roleApi.update({ id: modelId.value, ...params }) : roleApi.save(params);
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
