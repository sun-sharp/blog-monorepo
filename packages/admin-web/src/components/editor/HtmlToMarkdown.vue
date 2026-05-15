<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { initTurndownService } from './hooks/useHtmlToMarkdown';
  import { useClipboard } from '@vueuse/core';
  import { CopyOutlined } from '@/utils';

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
    source.value = mdText;
    emit('update:markdownText', mdText);
  };

  // 处理markdown展示问题
  const formatMdText = (val: string) => {
    return val.replace(/\n/g, '<br>');
  };

  // 复制
  const source = ref(props.markdownText);
  const { copy, copied, isSupported } = useClipboard({ source });

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
  <div class="html-to-markdown">
    <div class="html-to-markdown__cont" v-html="formatMdText(markdownText)"></div>
    <n-icon v-if="isSupported" size="18" class="copy-icon" @click="copy(source)">
      <CopyOutlined />
    </n-icon>
    <div v-show="copied" class="copy-tips">复制到剪贴板</div>
  </div>
</template>

<style lang="scss">
  .html-to-markdown {
    position: relative;
    width: 100%;
    min-height: 300px;
    border: 1px solid #ddd;

    &:hover {
      .copy-icon {
        color: #333;
      }
    }

    &__cont {
      width: 100%;
      height: 100%;
      padding: 10px;
      overflow-y: auto;
    }

    .copy-icon {
      position: absolute;
      top: 5px;
      right: 5px;
      color: #cfcfcf;
      cursor: pointer;
    }

    .copy-tips {
      position: absolute;
      top: 30px;
      right: 5px;
      padding: 5px;
      font-size: 12px;
      background: #fafaff;
      box-shadow: 0 0 2px 2px rgb(0 0 0 / 5%);
    }
  }
</style>
