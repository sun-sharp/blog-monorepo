<template></template>
<script lang="ts" setup>
  import { useMessage } from 'naive-ui';

  const win: WindowConfig = window;

  //挂载在 window 方便与在js中使用
  win['$message'] = useMessage();
</script>
