<script lang="ts" setup>
  import TurndownService from 'turndown';
  import { watch } from 'vue';

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

  // 将html转化为markdown
  const formatHtmlToMd = (htmlText: string) => {
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'indented',
      bulletListMarker: '-',
      hr: '- - -',
    });
    const mdText = turndownService.turndown(htmlText);
    emit('update:markdownText', mdText);
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
  <div class="html-to-markdown">{{ markdownText }}</div>
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
