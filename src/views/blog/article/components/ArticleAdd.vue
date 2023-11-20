<script lang="ts" setup>
  import { LeftOutlined } from '@/utils';
  import MdEditorInput from '@/components/editor/MdEditorInput.vue';
  import CodeMirrorInput from '@/components/editor/CodeMirrorInput.vue';
  import { ArticleAddProps, useArticleAdd } from '../hooks/useArticleAdd';

  const props = defineProps(ArticleAddProps);

  const emit = defineEmits(['changeShowType', 'finished']);

  const { addFormRef, addFromModel, contTab, addFromRules, categoryOptions, onSubmitOrEdit } = useArticleAdd(props, emit);
</script>

<template>
  <n-form ref="addFormRef" :model="addFromModel" :rules="addFromRules">
    <div class="flex justify-between mb-30">
      <n-button type="primary" text @click="emit('changeShowType', 'list')">
        <template #icon>
          <n-icon>
            <LeftOutlined />
          </n-icon>
        </template>
        返回
      </n-button>
      <n-button type="primary" @click="onSubmitOrEdit">保存</n-button>
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
      <n-tabs v-model:value="contTab" type="card">
        <n-tab-pane tab="markdown编辑器" name="md">
          <md-editor-input v-model:markdown-text="addFromModel.markdownContent" v-model:html-text="addFromModel.htmlContent" image-source="article_content" />
        </n-tab-pane>
        <n-tab-pane tab="code编辑器" name="code">
          <code-mirror-input />
        </n-tab-pane>
      </n-tabs>
      <!-- <md-editor-input v-model:markdown-text="addFromModel.markdownContent" v-model:html-text="addFromModel.htmlContent" image-source="article_content" /> -->
    </n-form-item>
  </n-form>
</template>

<style lang="scss" scoped></style>
