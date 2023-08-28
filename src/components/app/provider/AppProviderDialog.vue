<template>
  <n-dialog-provider>
    <slot />
  </n-dialog-provider>
</template>
<script lang="ts" setup>
  // import { useProviderStore } from '@/store';
  // import { useDialog } from 'naive-ui';

  // // 保存到状态管理
  // useProviderStore().setDialog(useDialog());

  //挂载在 window 方便与在js中使用
  // window['$dialog'] = useDialog();
</script>
