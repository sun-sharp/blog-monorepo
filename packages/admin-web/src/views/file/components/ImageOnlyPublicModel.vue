<script lang="ts" setup>
  import { useImageOnlyPublicModel } from '../hooks/useImageOnlyPublicModel';
  import TableAll from '@/components/table/TableAll.vue';

  const { showModal, btnLoading, imageOnlyData, columns, init, clearList } = useImageOnlyPublicModel();

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="w-800" :show-icon="false" :mask-closable="false" preset="dialog" title="处理只有图片文件的数据">
    <table-all :data="imageOnlyData" :columns="columns" />
    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="error" :loading="btnLoading" :disabled="btnLoading" @click="clearList">清空列表</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
