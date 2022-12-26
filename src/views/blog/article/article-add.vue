<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import MdEditorInput from '@/components/md-editor/md-editor-input.vue';
  // 初始化表单数据
  const modelFields = {
    title: null,
    roleCode: null,
    roleType: null,
    menuPermission: [],
    apiPermission: [],
  };

  const addFormRef = ref(null);
  const addFromModel = reactive<any>(Object.assign({}, modelFields));
  const addFromRules = {
    title: [
      { required: true, message: '请输入文章标题', trigger: ['blur', 'input'] },
      { min: 2, max: 30, message: '输入长度为2-30', trigger: ['blur', 'input'] },
    ],
    brief: [
      { required: true, message: '请输入文章简介', trigger: ['blur', 'input'] },
      { min: 5, message: '最短长度为5', trigger: ['blur', 'input'] },
    ],
  };

  // 确认保存或编辑
  const onSubmitOrEdit = () => {};
</script>

<template>
  <n-form ref="addFormRef" :model="addFromModel" :rules="addFromRules">
    <n-form-item path="title" label="文章标题">
      <n-input v-model:value="addFromModel.title" placeholder="请输入文章标题" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item path="brief" label="文章简介">
      <n-input
        v-model:value="addFromModel.brief"
        type="textarea"
        placeholder="请输入文章简介"
        :autosize="{
          minRows: 3,
          maxRows: 5,
        }"
        maxlength="300"
        show-count
        @keydown.enter.prevent
      />
    </n-form-item>
    <!-- <n-form-item path="title" label="文章标题">
      <n-input v-model:value="addFromModel.title" placeholder="请输入文章标题" @keydown.enter.prevent />
    </n-form-item> -->
    <n-form-item label="文章内容">
      <md-editor-input />
    </n-form-item>
    <n-form-item style="display: flex; justify-content: flex-end">
      <n-button type="primary" @click="onSubmitOrEdit">保存</n-button>
    </n-form-item>
  </n-form>
</template>

<style lang="scss" scoped></style>
