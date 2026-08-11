<script lang="ts" setup>
  import MdEditorInput from '@/components/editor/MdEditorInput.vue';
  import { useArticleAddUpdateModel } from '../hooks/useArticleAddUpdateModel';

  const emit = defineEmits(['finished']);

  const { showModal, modelTitle, modelFromRef, modelForm, modelRules, categoryOptions, cssNameOptions, formBtnLoading, init, onSubmitOrEdit } =
    useArticleAddUpdateModel(emit);

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="article-add-update-model" :show-icon="false" :mask-closable="false" preset="dialog" :title="modelTitle">
    <n-scrollbar class="article-add-update-model__scroll" trigger="none">
      <n-form ref="modelFromRef" class="article-add-update-model__form" :model="modelForm" :rules="modelRules">
        <n-form-item path="title" label="文章标题">
          <n-input v-model:value="modelForm.title" placeholder="请输入文章标题" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="brief" label="文章简介">
          <n-input
            v-model:value="modelForm.brief"
            type="textarea"
            placeholder="请输入文章简介"
            :autosize="{
              minRows: 3,
              maxRows: 5,
            }"
            maxlength="300"
            show-count
            @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="categoryVal" label="文章分类">
          <n-select v-model:value="modelForm.categoryVal" placeholder="请选择文章分类" filterable :options="categoryOptions" />
        </n-form-item>
        <n-form-item path="cssName" label="文章css名称">
          <n-select v-model:value="modelForm.cssName" placeholder="请选择文章css名称" filterable :options="cssNameOptions" />
        </n-form-item>
        <n-form-item path="markdownContent" label="文章内容">
          <div class="w-full">
            <md-editor-input v-model:markdown-text="modelForm.markdownContent" :preview-theme="modelForm.cssName || ''" image-source="article_content" />
            <!-- <code-mirror-input
              :model-value="codeHtmlText"
              :language-type="'html'"
              :autofocus="true"
              :show-html-to-md="true"
              :indent-with-tab="true"
              :tab-size="2"
              class="mt-10"
              @update:model-value="codeUpdateModelValue"
              @focus="codeUpdateIsFocus(true)"
              @blur="codeUpdateIsFocus(false)"
            />
            <html-to-markdown
              v-show="false"
              :markdown-text="codeMarkdownText"
              :html-text="codeHtmlText"
              class="mt-10"
              @update:markdown-text="codeUpdateMarkdownText"
            /> -->
          </div>
        </n-form-item>
      </n-form>
    </n-scrollbar>

    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" :disabled="formBtnLoading" @click="onSubmitOrEdit(true)">加密保存</n-button>
        <n-button type="info" :loading="formBtnLoading" :disabled="formBtnLoading" @click="onSubmitOrEdit()">保存</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style lang="scss">
  .article-add-update-model {
    width: 100vw !important;
    max-width: 100vw !important;
    height: 100vh;
    border-radius: 0;

    &__scroll {
      max-height: 82vh;
    }

    &__form {
      padding: 0 40px;
    }
  }
</style>
