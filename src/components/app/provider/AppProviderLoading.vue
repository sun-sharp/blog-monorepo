<template>
  <n-loading-bar-provider>
    <slot />
  </n-loading-bar-provider>
</template>
<script lang="ts" setup>
  // import { useProviderStore } from '@/store';
  // import { useLoadingBar } from 'naive-ui';

  // 保存到状态管理
  // useProviderStore().setLoading(useLoadingBar());
  //挂载在 window 方便与在js中使用
  // window['$loading'] = useLoadingBar();
</script>
