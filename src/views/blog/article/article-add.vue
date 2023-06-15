<script lang="ts" setup>
  import { articleAPi } from '@/api';
  import { ref, reactive, watch } from 'vue';
  import { FormItemRule } from 'naive-ui';
  import { LeftOutlined } from '@/utils';
  import MdEditorInput from '@/components/md-editor/md-editor-input.vue';

  const props = defineProps({
    row: {
      type: Object,
      default: () => ({}),
    },
    categoryOptions: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits(['changeShowType', 'finished']);

  // 初始化表单数据
  const modelFields = {
    title: null,
    brief: null,
    categoryVal: null,
    markdownContent: '',
    htmlContent: '',
  };

  const addFormRef = ref<any>(null);
  const addFromModel = reactive<any>(Object.assign({}, modelFields));

  // 验证规则
  const validateMarkdown = (_rule: FormItemRule, value: string) => {
    if (!value) {
      return new Error('请输入文章内容');
    } else if (!addFromModel.htmlContent) {
      return new Error('预览文章内容数据不能为空，请检查代码');
    }
    return true;
  };
  const addFromRules = {
    title: [
      { required: true, message: '请输入文章标题', trigger: ['blur', 'input'] },
      { min: 2, max: 30, message: '输入长度为2-30', trigger: ['blur', 'input'] },
    ],
    brief: [
      { required: true, message: '请输入文章简介', trigger: ['blur', 'input'] },
      { min: 5, message: '最短长度为5', trigger: ['blur', 'input'] },
    ],
    categoryVal: { type: 'number', required: true, message: '请选择文章分类', trigger: ['blur', 'change'] },
    markdownContent: {
      required: true,
      validator: validateMarkdown,
      trigger: ['input', 'blur'],
    },
  };

  // 确认保存或编辑
  let isEdit = false;
  const onSubmitOrEdit = () => {
    addFormRef.value?.validate((errors: any) => {
      if (!errors) {
        let req = isEdit ? articleAPi.update : articleAPi.save;
        const postData = { ...addFromModel, ...(isEdit ? { articleId: props.row.articleId } : {}) };
        req(postData).then(() => {
          emit('changeShowType', 'list');
          emit('finished');
        });
      }
    });
  };

  watch(
    () => props.row,
    (obj) => {
      isEdit = !!obj.articleId;
      if (isEdit) {
        // 编辑
        // 进行赋值
        for (const key in modelFields) {
          addFromModel[key] = obj[key];
        }
      } else {
        Object.assign(addFromModel, modelFields);
      }
    },
    { immediate: true, deep: true }
  );
</script>

<template>
  <n-form ref="addFormRef" :model="addFromModel" :rules="addFromRules">
    <div class="flex justify-start mb-30">
      <n-button type="primary" text @click="emit('changeShowType', 'list')">
        <template #icon>
          <n-icon>
            <LeftOutlined />
          </n-icon>
        </template>
        返回
      </n-button>
    </div>
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
    <n-form-item path="categoryVal" label="文章分类">
      <n-select v-model:value="addFromModel.categoryVal" placeholder="请选择文章分类" filterable :options="categoryOptions" />
    </n-form-item>
    <n-form-item path="markdownContent" label="文章内容">
      <md-editor-input
        v-model:markdown-text="addFromModel.markdownContent"
        v-model:html-text="addFromModel.htmlContent"
        image-source="article_content"
        @on-save="onSubmitOrEdit"
      />
    </n-form-item>
  </n-form>
</template>

<style lang="scss" scoped></style>
