<script lang="ts" setup>
  import TableToolbar from './TableToolbar.vue';
  import { BasicTableProps, useBasicTable } from './hooks/useBasicTable';

  const props = defineProps(BasicTableProps);

  const emit = defineEmits(['fetch-success', 'fetch-error', 'update:checked-row-keys', 'edit-end', 'edit-cancel', 'edit-row-end', 'edit-change']);

  const {
    tableSize,
    tableElRef,
    geTableBindProps,
    getTableToolbarProps,
    pagination,
    updatePage,
    updatePageSize,
    updateCheckedRowKeys,
    reload,
    debounceTableHeight,
  } = useBasicTable(props, emit);

  defineExpose({ updatePage, reload, debounceTableHeight });
</script>

<template>
  <table-toolbar v-model:size="tableSize" v-bind="getTableToolbarProps">
    <template #tableTitle>
      <slot name="tableTitle"></slot>
    </template>
  </table-toolbar>
  <div class="basic-table">
    <n-data-table
      ref="tableElRef"
      v-bind="geTableBindProps"
      :pagination="pagination"
      @update:page="updatePage"
      @update:page-size="updatePageSize"
      @on-update:checked-row-keys="updateCheckedRowKeys"
    />
  </div>
</template>
