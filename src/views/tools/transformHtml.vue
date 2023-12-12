<script lang="ts" setup>
  import CodeMirrorInput from '@/components/editor/CodeMirrorInput.vue';
  import { useContSize, useLayoutSizeSetting } from '@/hooks';
  import { LeftOutlined } from '@/utils';
  import HtmlToMarkdown from '@/components/editor/HtmlToMarkdown.vue';
  import MdEditorPreview from '@/components/editor/MdEditorPreview.vue';
  import { computed, ref, unref } from 'vue';
  const { mainViewPadding } = useLayoutSizeSetting();
  // 除去card内边距和设置内边距
  const contHeight = computed(() => useContSize.height - unref(mainViewPadding) * 2);

  const codeHtmlText = ref('');

  const codeMarkdownText = ref('');

  // 转化md
  const showMarkdown = ref(false);
  const showMarkdownBtn = () => {
    showMarkdown.value = true;
  };

  // 关闭
  const closeMarkdownBtn = () => {
    showMarkdown.value = false;
  };
</script>

<template>
  <n-card
    :style="{
      height: `${contHeight}px`,
    }"
    class="transform-html"
    :bordered="false"
  >
    <template #header>
      <n-button v-if="showMarkdown" text @click="closeMarkdownBtn()">
        <n-icon><LeftOutlined /></n-icon>
        返回
      </n-button>
      <template v-else>
        <n-button style="float: right" type="primary" @click="showMarkdownBtn()">转化成Markdown</n-button>
      </template>
    </template>
    <code-mirror-input
      v-show="!showMarkdown"
      v-model:model-value="codeHtmlText"
      :language-type="'html'"
      :autofocus="true"
      :show-html-to-md="true"
      :indent-with-tab="true"
      :tab-size="2"
    />
    <div v-show="showMarkdown" class="transform-html__preview">
      <html-to-markdown v-model:markdown-text="codeMarkdownText" :html-text="codeHtmlText" class="flex-1" />
      <md-editor-preview :markdown-text="codeMarkdownText" class="ml-10 flex-1" />
    </div>
  </n-card>
</template>

<style lang="scss">
  .transform-html {
    height: 100%;
    position: relative;

    &__preview {
      // position: absolute;
      // left: 0;
      // top: 0;
      // z-index: 99;
      display: flex;
      width: 100%;
      height: 100%;
    }
  }
</style>
