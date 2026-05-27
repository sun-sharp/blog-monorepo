<template>
  <!-- Vditor 的容器，ref 用于获取 DOM 元素引用 -->
  <div ref="vditorRef" class="vditor-container"></div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';

  // 定义组件的 Props 和 Emits，实现 v-model 双向绑定
  const props = defineProps<{
    modelValue: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  // 1. 获取 DOM 容器的引用
  const vditorRef = ref<HTMLDivElement>();
  let vditor: Vditor | null = null;

  // 3. 在组件挂载后，执行初始化的核心逻辑
  onMounted(() => {
    if (!vditorRef.value) return;

    // 初始化 Vditor 编辑器
    vditor = new Vditor(vditorRef.value, {
      // 基础配置：设置高度、模式与默认内容
      height: 'calc(100vh - 50px)',
      mode: 'sv', // 推荐移动端使用即时渲染模式[reference:4]
      value: props.modelValue, // 从 props 接收初始内容

      // 核心事件：监听输入变化，并同步回父组件
      input: (value: string) => {
        emit('update:modelValue', value);
      },

      // 初始化完成后的回调，确保编辑器完全就绪
      after: () => {
        // 如果有需要，可以在此处执行一些额外操作
        console.log('Vditor 编辑器初始化完成');
      },

      // 可在此添加更多配置，如图片上传、工具栏定制等
      // 图片上传等高级配置将在下文补充
    });
  });

  // 4. 监听外部 modelValue 的变化，并在必要时同步到编辑器
  watch(
    () => props.modelValue,
    (newValue) => {
      if (vditor && newValue !== vditor.getValue()) {
        vditor.setValue(newValue);
      }
    }
  );

  // 5. 在组件销毁前，务必调用 vditor.destroy() 释放资源
  onBeforeUnmount(() => {
    if (vditor) {
      vditor.destroy();
      vditor = null;
    }
  });
</script>

<style scoped>
  .vditor-container {
    width: 100%;
    /* 确保容器高度正确，可按需调整 */
    min-height: 300px;
  }
</style>
