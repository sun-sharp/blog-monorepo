<script lang="ts" setup>
  import CodeMirrorInput from '@/components/editor/CodeMirrorInput.vue';
  import HtmlToMarkdown from '@/components/editor/HtmlToMarkdown.vue';
  import { ref } from 'vue';

  const codeHtmlText = ref('');
  const codeMarkdownText = ref('codeMarkdownText');
</script>

<template>
  <n-card class="html-to-markdown" :bordered="false">
    <code-mirror-input
      v-model:model-value="codeHtmlText"
      :language-type="'html'"
      :autofocus="true"
      :show-html-to-md="true"
      :indent-with-tab="true"
      :tab-size="2"
    />
    <html-to-markdown v-model:markdown-text="codeMarkdownText" :html-text="codeHtmlText" class="mt-10" />
  </n-card>
</template>

<style lang="scss">
  .html-to-markdown {
    display: block;
  }
</style>
