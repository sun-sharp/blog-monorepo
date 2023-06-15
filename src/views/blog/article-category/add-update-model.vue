<template>
  <n-modal v-model:show="showModal" class="w-600" :show-icon="false" :mask-closable="false" preset="dialog" :title="modelId ? '修改' : '新增'">
    <n-form ref="modelFromRef" :model="modelForm" :rules="modelRules" label-placement="left" :label-width="120">
      <n-form-item :label="`名称`" path="title">
        <n-input v-model:value="modelForm.name" :placeholder="`请输入名称`" />
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
  import { articleCategoryAPi } from '@/api';

  const modelFields = {
    name: '',
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
        name: {
          required: true,
          trigger: ['blur', 'input'],
          message: `请输入名称`,
        },
      });

      // 初始化
      const init = (row) => {
        showModal.value = true;
        modelId.value = row?.menuId;
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
            const request = articleCategoryAPi.saveArticleCategory(params);
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
        init,
        confirmForm,
      };
    },
  });
</script>

<style lang="scss"></style>
