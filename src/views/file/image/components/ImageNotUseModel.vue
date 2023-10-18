<script lang="ts" setup>
  import TableAll from '@/components/table/TableAll.vue';
  import { useImageNotUseModel } from '../hooks/useImageNotUseModel';

  const emit = defineEmits(['refresh']);

  const { showModal, btnLoading, tableData, columns, init, clearList } = useImageNotUseModel(emit);

  defineExpose({ init });
</script>

<template>
  <n-modal v-model:show="showModal" class="w-1000" :show-icon="false" :mask-closable="false" preset="dialog" title="查询未使用的图片">
    <table-all :data="tableData" :columns="columns" />
    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="error" :loading="btnLoading" :disabled="btnLoading" @click="clearList">清空列表</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style lang="scss" scoped></style>
