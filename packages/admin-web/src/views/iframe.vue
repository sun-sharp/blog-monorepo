<template>
  <n-spin :show="loading">
    <div class="frame">
      <iframe ref="frameRef" :src="iframeSrc" class="frame-iframe"></iframe>
    </div>
  </n-spin>
</template>
<script lang="ts" setup>
  import { ref, unref, onMounted, nextTick } from 'vue';
  import { useRoute } from 'vue-router';

  const currentRoute = useRoute();
  const loading = ref<boolean>(false);
  const frameRef = ref<HTMLFrameElement | null>(null);
  const iframeSrc = ref<string>('');

  if (unref(currentRoute.meta)?.iframeSrc) {
    iframeSrc.value = unref(currentRoute.meta)?.iframeSrc as string;
  }

  const hideLoading = () => {
    loading.value = false;
  };

  const init = () => {
    nextTick(() => {
      const iframe = unref(frameRef);
      if (!iframe) return;
      const _frame: HTMLFrameElement & { attachEvent?: (e: string, fn: () => void) => void } = iframe;
      if (_frame.attachEvent) {
        _frame.attachEvent('onload', () => {
          hideLoading();
        });
      } else {
        iframe.onload = () => {
          hideLoading();
        };
      }
    });
  };

  onMounted(() => {
    loading.value = true;
    init();
  });
</script>

<style lang="scss" scoped>
  .frame {
    width: 100%;
    height: 100vh;

    &-iframe {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: 0;
    }
  }
</style>
