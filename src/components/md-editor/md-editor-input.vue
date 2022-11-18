<template>
  <md-editor-v3 v-model="text" :toolbars="toolbars" />
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';

  const props = {
    toolbars: {
      type: Array,
      default: [
        'bold', // 加粗
        'underline', // 加下划线
        'italic', // 斜体
        '-',
        'title', // 标题
        'strikeThrough', // 删除线
        'sub', // 下标
        'sup', // 上标
        'quote', // 引用
        'unorderedList', // 无序列表
        'orderedList', // 有序列表
        'task', // 任务列表
        '-',
        'codeRow', // 行内代码
        'code', // 块级代码
        'link', // 链接
        'image', // 图片
        'table', // 表格
        'mermaid', // mermaid图
        'katex', // katex公式
        '-',
        'revoke', // 后退
        'next', // 前进
        'save', // 保存
        '=',
        'pageFullscreen', // 浏览器全屏
        'fullscreen', // 屏幕全屏
        'preview', // 预览
        'htmlPreview', // html代码预览
        'catalog', // 目录
        'github', // 源码地址
      ],
    }, // 开始数字
  };

  export default defineComponent({
    name: 'CountTo',
    props,
    emits: ['onStarted', 'onFinished'],
    setup() {
      const text = ref('');
      return { text };
    },
  });
</script>
