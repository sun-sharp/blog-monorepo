<script lang="ts" setup>
  import { watch } from 'vue';
  import { initTurndownService } from './hooks/useHtmlToMarkdown';

  const props = defineProps({
    htmlText: {
      type: String,
      default: '',
    },
    markdownText: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:markdownText']);

  const turndownService = initTurndownService();

  // 将html转化为markdown
  const formatHtmlToMd = (htmlText: string) => {
    const mdText = turndownService.turndown(htmlText);
    emit('update:markdownText', mdText);
  };

  // 处理markdown展示问题
  const formatMdText = (val: string) => {
    return val.replace(/\n/g, '<br>');
  };

  // 监听 prop.htmlText
  watch(
    () => props.htmlText,
    (htmlText) => {
      formatHtmlToMd(htmlText);
    },
    {
      immediate: true,
      deep: true,
    }
  );
</script>

<template>
  <div class="html-to-markdown" v-html="formatMdText(markdownText)"></div>
</template>

<style lang="scss">
  .html-to-markdown {
    width: 100%;
    min-height: 300px;
    padding: 10px;
    overflow-y: auto;
    border: 1px solid #ddd;
  }
</style>
