<script lang="ts" setup>
  import CodeMirrorInput from '@/components/editor/CodeMirrorInput.vue';
  import HtmlToMarkdown from '@/components/editor/HtmlToMarkdown.vue';
  import MdEditorPreview from '@/components/editor/MdEditorPreview.vue';
  import { ref } from 'vue';

  const codeHtmlText = ref('');
  const codeMarkdownText = ref('');
</script>

<template>
  <n-card class="transform-html" :bordered="false">
    <code-mirror-input
      v-model:model-value="codeHtmlText"
      :language-type="'html'"
      :autofocus="true"
      :show-html-to-md="true"
      :indent-with-tab="true"
      :tab-size="2"
    />
    <div class="mt-10 flex">
      <html-to-markdown v-model:markdown-text="codeMarkdownText" :html-text="codeHtmlText" class="flex-1 preview-height" />
      <md-editor-preview :markdown-text="codeMarkdownText" class="ml-10 flex-1 preview-height" />
    </div>
  </n-card>
</template>

<style lang="scss">
  .transform-html {
    .preview-height {
      max-height: 500px;
    }
  }
</style>
