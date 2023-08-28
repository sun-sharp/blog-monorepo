<template>
  <n-message-provider>
    <slot />
  </n-message-provider>
</template>
<script lang="ts" setup>
  // import { useProviderStore } from '@/store';
  // import { useMessage } from 'naive-ui';

  // // 保存到状态管理
  // useProviderStore().setMessage(useMessage());

  //挂载在 window 方便与在js中使用
  // window['$message'] = useMessage();
</script>
