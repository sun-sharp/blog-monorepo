<template>
  <u-loading-popup v-model="visible" :text="text" mode="circle" color="#fff" size="80" />
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { loading } from '../../utils/loading';

  const visible = ref(false);
  const text = ref('加载中...');

  function handleShow(params: { text: string }) {
    text.value = params.text || '加载中...';
    visible.value = true;
  }

  function handleHide() {
    visible.value = false;
  }

  onMounted(() => {
    uni.$on(loading.SHOW_EVENT, handleShow);
    uni.$on(loading.HIDE_EVENT, handleHide);
  });

  onUnmounted(() => {
    uni.$off(loading.SHOW_EVENT, handleShow);
    uni.$off(loading.HIDE_EVENT, handleHide);
  });
</script>
