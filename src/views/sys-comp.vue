<script lang="ts" setup>
  import { constantAntdHtmlIcon, constantIonicons5HtmlIcon } from '@/utils';
  import { ref } from 'vue';

  const iconAntdOptions = ref<any[]>(
    Object.keys(constantAntdHtmlIcon).map((key) => ({
      label: constantAntdHtmlIcon[key],
      value: key,
    }))
  );

  const iconIonicons5Options = ref<any[]>(
    Object.keys(constantIonicons5HtmlIcon).map((key) => ({
      label: constantIonicons5HtmlIcon[key],
      value: key,
    }))
  );
</script>

<template>
  <div class="sys-comp">
    <n-card :bordered="false" title="组件Antd图标" size="small" :segmented="{ content: 'hard' }">
      <n-descriptions bordered label-placement="left" content-style="text-align: center">
        <n-descriptions-item v-for="item in iconAntdOptions" :key="item.value" :label="item.value">
          <component :is="item.label" size="22" />
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
    <n-card :bordered="false" title="组件Ionicons5图标" class="mt-4" size="small" :segmented="{ content: 'hard' }">
      <n-descriptions bordered label-placement="left" content-style="text-align: center">
        <n-descriptions-item v-for="item in iconIonicons5Options" :key="item.value" :label="item.value">
          <component :is="item.label" size="22" />
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
