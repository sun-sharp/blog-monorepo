<script lang="ts" setup>
  import { constantAntdHtmlIcon, constantIonicons5HtmlIcon } from '@/utils';
  import { computed, ref } from 'vue';

  // const columnNum = ref(3);

  // Antd图标
  const iconAntdOptions = computed(() =>
    Object.entries(constantAntdHtmlIcon).map(([key, icon]) => ({
      value: key,
      label: icon,
    }))
  );

  // Ionicons5图标
  const iconIonicons5Options = ref<any[]>(
    Object.entries(constantIonicons5HtmlIcon).map(([key, icon]) => ({
      value: key,
      label: icon,
    }))
  );
</script>

<template>
  <div class="sys-comp">
    <n-card :bordered="false" title="组件Antd图标" size="small" :segmented="{ content: 'hard' }">
      <n-descriptions bordered label-placement="left" content-style="text-align: center">
        <n-descriptions-item v-for="(item, index) in iconAntdOptions" :key="index" :label="item.value">
          <component :is="item.label" size="22" />
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
    <n-card :bordered="false" title="组件Ionicons5图标" class="mt-4" size="small" :segmented="{ content: 'hard' }">
      <n-descriptions bordered label-placement="left" content-style="text-align: center">
        <n-descriptions-item v-for="(item, index) in iconIonicons5Options" :key="index" :label="item.value">
          <component :is="item.label" size="22" />
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
  </div>
</template>

<style lang="scss"></style>
