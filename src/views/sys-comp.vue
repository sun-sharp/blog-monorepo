<script lang="ts" setup>
  import { constantHtmlIcon } from '@/utils';
  import { ref } from 'vue';

  const iconOptions = ref<any[]>(
    Object.keys(constantHtmlIcon).map((key) => ({
      label: constantHtmlIcon[key],
      value: key,
    }))
  );
</script>

<template>
  <div class="sys-comp">
    <n-card :bordered="false" title="组件图标" class="mt-4 pro-card" size="small" :segmented="{ content: 'hard' }">
      <n-descriptions bordered label-placement="left" class="py-2">
        <n-descriptions-item v-for="item in iconOptions" :key="item.value" :label="item.value">
          <component :is="item.label" />
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
  </div>
</template>

<style lang="scss">
  .sys-comp {
    display: block;
  }
</style>
