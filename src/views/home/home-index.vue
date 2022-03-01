<template>home</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { homeApi } from '@/api';

  onMounted(async () => {
    const consoleInfo = await homeApi.getConsoleInfo();
    console.log(consoleInfo);

    // visits.value = consoleInfo.visits;
    // saleroom.value = consoleInfo.saleroom;
    // orderLarge.value = consoleInfo.orderLarge;
    // volume.value = consoleInfo.volume;
    // loading.value = false;
  });
</script>
