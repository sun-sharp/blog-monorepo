<template>
  <n-modal v-model:show="showModal" class="menu-model w-600" :show-icon="false" preset="dialog" :title="modelId ? '修改' : '新增'">
    <n-form ref="modelFromRef" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item label="角色名称`" path="name">
        <n-input v-model:value="modelForm.name" placeholder="请输入角色名称" />
      </n-form-item>
      <n-form-item label="角色标识" path="roleCode">
        <n-input v-model:value="modelForm.roleCode" placeholder="请输入角色标识" />
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
  import { menuTypeOption } from '@/enums/apiEnum';
  import { saveMenu, updateMenu } from '@/api';

  const modelFields = {
    name: '',
    roleCode: '',
  };

  export default defineComponent({
    emits: ['refurbish'],
    setup(_props, { emit }) {
      const modelId = ref('');
      const showModal = ref(false);

      const formBtnLoading = ref(false);
      const modelFromRef = ref();
      const modelForm = reactive(Object.assign({}, modelFields));
      const modelRules = reactive({
        menuType: {
          type: 'number',
          required: true,
          trigger: ['change', 'blur'],
          message: '请选择类型',
        },
        title: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入名称`,
        },
        path: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入路由`,
        },
        name: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入标识`,
        },
        component: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入位置`,
        },
        iframeSrc: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入链接`,
        },
        icon: {
          required: true,
          trigger: ['blur', 'change'],
          message: '请选择',
        },
        parentId: {
          required: true,
          trigger: 'change',
          message: '请输入地址',
        },
        sort: {
          type: 'number',
          required: true,
          trigger: ['blur', 'change'],
          message: '请输入排序号',
        },
      });

      // 初始化
      const init = (row) => {
        showModal.value = true;
        modelId.value = row?._id;
        resetFields();
        if (modelId.value) {
          modelForm.name = row.name;
        }
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
            const request = modelId.value ? updateMenu({ id: modelId.value, ...params }) : saveMenu(params);
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
        menuTypeOption,
        init,
        confirmForm,
      };
    },
  });
</script>

<style lang="scss"></style>
