<script lang="ts" setup>
  import { COMPONENT_UPLOAD } from '@/constant';
  import axios, { AxiosRequestConfig } from 'axios';
  import { useMessage } from 'naive-ui';
  import { useUserStore } from '@/store';
  import { getImgUrl, getUploadImageAction } from '@/utils';
  import { MdEditor, ToolbarNames } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  // import cssTextCont from 'md-editor-v3/lib/style.css?inline';
  import { computed, ref, watchEffect } from 'vue';

  const props = defineProps({
    toolbars: {
      type: [Array] as PropType<ToolbarNames[]>,
      default: () => [
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
        '=',
        'pageFullscreen', // 浏览器全屏
        'fullscreen', // 屏幕全屏
        'preview', // 预览
        // 'htmlPreview', // html代码预览
        // 'catalog', // 目录
        // 'github', // 源码地址
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
    markdownText: {
      type: String,
      default: '',
    },
    imageSource: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits(['update:markdownText', 'focus', 'blur']);

  const nMessage = useMessage();

  const text = ref('');

  const getMdEditorBind = computed(() => {
    return {
      toolbars: props.toolbars,
      editorId: props.editorId,
      placeholder: props.placeholder,
    };
  });

  watchEffect(() => {
    text.value = props.markdownText;
  });

  // 上传图片
  const uploadImageAction = getUploadImageAction();
  const userStore = useUserStore();
  const completeToken = userStore.getCompleteToken;
  const uploadHeaders = computed(() => {
    return {
      source: props.imageSource,
      timestamp: new Date().getTime(),
      Authorization: completeToken,
    };
  });
  const onUploadImg = async (files: any[], callback: (arg: any[]) => void) => {
    const res = await Promise.all(
      files.map((file: File) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append('image', file);
          const headers = { ...uploadHeaders.value, 'Content-Type': 'multipart/form-data' };
          axios
            .request({
              url: uploadImageAction as string,
              method: 'POST',
              data: formData,
              withCredentials: false,
              headers: headers,
            } as AxiosRequestConfig)
            .then((res: any) => {
              const infoField = COMPONENT_UPLOAD.apiInfoField;
              const imgField = COMPONENT_UPLOAD.apiImgField;
              const aData = res.data || {};
              const { code, message = '上传失败' } = aData;
              const result = aData[infoField];
              if (code === 0 && typeof result === 'object') {
                const url = result[imgField];
                nMessage.success(message);
                resolve(getImgUrl(url));
              } else {
                nMessage.error(message);
                reject('');
              }
            })
            .catch((error) => {
              nMessage.error(error.message);
              reject('');
            });
        });
      })
    );
    callback(res);
  };

  // 内容变化回调事件
  const onChange = (v: string) => {
    emit('update:markdownText', v);
  };

  // 输入框失去焦点时触发事件
  const onBlur = () => {
    emit('blur', false);
  };

  // 输入框获得焦点时触发事件
  const onFocus = () => {
    emit('focus', true);
  };
</script>

<template>
  <md-editor
    v-model="text"
    v-bind="getMdEditorBind"
    preview-theme="github"
    :preview="false"
    @onChange="onChange"
    @onUploadImg="onUploadImg"
    @onBlur="onBlur"
    @onFocus="onFocus" />
</template>
