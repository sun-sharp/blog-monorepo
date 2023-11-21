<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, shallowRef, toRaw, watch } from 'vue';
  import { basicSetup } from 'codemirror';
  import { EditorView } from '@codemirror/view';
  import { EditorState } from '@codemirror/state';
  import { javascript } from '@codemirror/lang-javascript';
  import { html } from '@codemirror/lang-html';
  import { json } from '@codemirror/lang-json';
  import { css } from '@codemirror/lang-css';
  import { sass } from '@codemirror/lang-sass';
  import { less } from '@codemirror/lang-less';
  import { vue } from '@codemirror/lang-vue';
  import { markdown } from '@codemirror/lang-markdown';
  import { python } from '@codemirror/lang-python';
  import { java } from '@codemirror/lang-java';
  import {
    ConfigProps,
    DEFAULT_CONFIG,
    createEditorState,
    CodeMirrorInputProps,
    createEditorView,
    getEditorTools,
    destroyEditorView,
  } from './hooks/useCodeMirrorInput';

  const props = defineProps(CodeMirrorInputProps);

  const emit = defineEmits(['change', 'update', 'focus', 'blur', 'ready', 'update:modelValue']);

  const codeMirrorInputRef = shallowRef<HTMLDivElement>();
  const state = shallowRef<EditorState>();
  const view = shallowRef<EditorView>();

  const config = computed<ConfigProps>(() => {
    const result = {} as Required<ConfigProps>;
    Object.keys(toRaw(props)).forEach((key: string) => {
      if (key !== 'modelValue') {
        // @ts-ignore
        result[key] = props[key] ?? DEFAULT_CONFIG[key];
      }
    });
    return result;
  });

  // 扩展配置
  const extensionsConfig = computed(() => {
    // 基础设置，自动换行
    const arr = [basicSetup, EditorView.lineWrapping];
    switch (props.languageType) {
      case 'javaScript':
        arr.push(javascript());
        break;
      case 'html':
        arr.push(html());
        break;
      case 'css':
        arr.push(css());
        break;
      case 'sass':
        arr.push(sass());
        break;
      case 'less':
        arr.push(less());
        break;
      case 'json':
        arr.push(json());
        break;
      case 'markdown':
        arr.push(markdown());
        break;
      case 'vue':
        arr.push(vue());
        break;
      case 'python':
        arr.push(python());
        break;
      case 'java':
        arr.push(java());
        break;
      default:
        break;
    }
    return arr;
  });

  onMounted(() => {
    state.value = createEditorState({
      doc: props.modelValue,
      selection: config.value.selection,
      extensions: extensionsConfig.value,
      onFocus: (viewUpdate) => emit('focus', viewUpdate),
      onBlur: (viewUpdate) => emit('blur', viewUpdate),
      onUpdate: (viewUpdate) => emit('update', viewUpdate),
      onChange: (newDoc, viewUpdate) => {
        if (newDoc !== props.modelValue) {
          emit('change', newDoc, viewUpdate);
          emit('update:modelValue', newDoc, viewUpdate);
        }
      },
    });

    view.value = createEditorView({
      state: state.value,
      parent: codeMirrorInputRef.value,
      root: config.value.root,
    });

    const editorTools = getEditorTools(view.value);

    // 监听 prop.modelValue
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue !== editorTools.getDoc()) {
          editorTools.setDoc(newValue);
        }
      }
    );

    // 监听 prop.extensions
    watch(
      () => props.languageType,
      () => editorTools.reExtensions(extensionsConfig.value || []),
      { immediate: true }
    );

    // 监听 prop.disabled
    watch(
      () => config.value.disabled,
      (disabled) => editorTools.toggleDisabled(disabled),
      { immediate: true }
    );

    // 监听 prop.indentWithTab
    watch(
      () => config.value.indentWithTab,
      (iwt) => editorTools.toggleIndentWithTab(iwt),
      { immediate: true }
    );

    // 监听 prop.tabSize
    watch(
      () => config.value.tabSize,
      (tabSize) => editorTools.setTabSize(tabSize!),
      { immediate: true }
    );

    // 监听 props.phrases
    watch(
      () => props.phrases,
      (phrases = {}) => {
        editorTools.setPhrases(phrases);
      },
      { immediate: true }
    );

    // 监听 prop.placeholder
    watch(
      () => config.value.placeholder,
      (placeholder) => editorTools.setPlaceholder(placeholder!),
      { immediate: true }
    );

    // 监听 prop.style
    watch(
      () => config.value.style,
      (style) => editorTools.setStyle(style),
      { immediate: true }
    );

    // 立即对焦
    if (config.value.autofocus) {
      editorTools.focus();
    }

    emit('ready', {
      state: state.value!,
      view: view.value!,
      container: codeMirrorInputRef.value!,
    });
  });

  onBeforeUnmount(() => {
    if (config.value.autoDestroy && view.value) {
      destroyEditorView(view.value);
    }
  });
</script>

<template>
  <div ref="codeMirrorInputRef" class="code-mirror-input"></div>
</template>

<style lang="scss">
  .code-mirror-input {
    display: flex;
    width: 100%;
    height: 100%;

    .cm-editor {
      width: 100%;
      min-height: 300px;
      border: 1px solid #ddd;
    }
  }
</style>
