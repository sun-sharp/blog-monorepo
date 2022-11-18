<template>
  <md-editor-v3 v-model="text" v-bind="getMdEditorBind" @onSave="onSave" @onUploadImg="onUploadImg" @onHtmlChanged="onHtmlChanged" />
</template>
<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';

  const joinProps = {
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
    }, // 选择性展示工具栏（通过'-'分割两个工具，通过'='实现左右放置）
    editorId: { type: String, default: 'md-editor-v3' }, // 单页面多编辑器时做区别
    placeholder: { type: String, default: '请输入' },
    codeTheme: {
      validator(value: string) {
        return ['atom', 'a11y', 'github', 'gradient', 'kimbie', 'paraiso', 'qtcreator', 'stackoverflow'].includes(value);
      },
      default: 'atom',
    }, // 代码块高亮样式名称
  };

  export default defineComponent({
    name: 'CountTo',
    props: joinProps,
    emits: ['onStarted', 'onFinished'],
    setup(props) {
      const text = ref('');

      const getMdEditorBind = computed(() => {
        return {
          toolbars: props.toolbars,
          editorId: props.editorId,
          placeholder: props.placeholder,
        };
      });

      // 保存
      const onSave = (val: string) => {
        console.log(val, 'onSave');
      };

      // 上传图片
      const onUploadImg = async (files: any[], callback: (arg: any[]) => void) => {
        const res = await Promise.all(
          files.map((file: any) => {
            return new Promise((resolve, reject) => {
              console.log(file);
              console.log(resolve, reject);
            });
          })
        );

        // callback(res.map((item) => item.data.url));
        callback(res);
      };

      // html 变化回调事件
      const onHtmlChanged = (h: string) => {
        console.log(h, 'onHtmlChanged');
      };
      return { text, getMdEditorBind, onSave, onUploadImg, onHtmlChanged };
    },
  });
</script>
