<template>
  <md-editor-v3 v-model="text" v-bind="getMdEditorBind" @onChange="onChange" @onSave="onSave" @onUploadImg="onUploadImg" @onHtmlChanged="onHtmlChanged" />
</template>
<script lang="ts" setup>
  import { componentUpload } from '@/constant';
  import { useUserStoreWidthOut } from '@/store';
  import { getImgUrl, getUploadImageAction } from '@/utils';
  import axios, { AxiosRequestConfig } from 'axios';
  import { useMessage } from 'naive-ui';
  import { computed, ref, watchEffect } from 'vue';

  const props = defineProps({
    toolbars: {
      type: Array,
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
        'save', // 保存
        '=',
        'pageFullscreen', // 浏览器全屏
        'fullscreen', // 屏幕全屏
        'preview', // 预览
        'htmlPreview', // html代码预览
        'catalog', // 目录
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
    htmlText: {
      type: String,
      default: '',
    },
    markdownText: {
      type: String,
      default: '',
    },
    imageSource: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits(['onSave', 'update:htmlText', 'update:markdownText']);

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

  // 保存
  const onSave = (v: string, h: Promise<string>) => {
    emit('update:markdownText', v || '');
    if (h) {
      h.then((html) => {
        emit('update:htmlText', html);
        emit('onSave', v, html);
      });
    } else {
      emit('update:htmlText', '');
      emit('onSave', v, '');
    }
  };

  // 上传图片
  const uploadImageAction = getUploadImageAction();
  const userStore = useUserStoreWidthOut();
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
          axios
            .request({
              url: uploadImageAction as string,
              method: 'POST',
              data: formData,
              withCredentials: false,
              headers: uploadHeaders.value,
            } as AxiosRequestConfig)
            .then((res: any) => {
              const infoField = componentUpload.apiSetting.infoField;
              const imgField = componentUpload.apiSetting.imgField;
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

    // callback(res.map((item) => item.data.url));
    console.log(res);
    callback(res);
  };

  // html 变化回调事件
  const onHtmlChanged = (h: string) => {
    emit('update:htmlText', h);
  };

  // 内容变化回调事件
  const onChange = (v: string) => {
    emit('update:markdownText', v);
  };
</script>
