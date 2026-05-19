<script lang="ts" setup>
  import { useMenuConfigure } from './hooks/useMenuConfigure';
  import { ApiLevelMenuItem } from '/#/api/capital/menu';
  import FormSearch from '@/components/form/FormSearch.vue';
  import MenuAddUpdateModel from './components/MenuAddUpdateModel.vue';
  import TableToolbar from '@/components/table/TableToolbar.vue';
  import { PlusOutlined } from '@/utils';

  // 表格key
  const rowKey = (row: ApiLevelMenuItem) => row.name;
  const { addUpdateModelRef, searchSchemas, tableSize, tableLoading, tableData, columns, expandedRowKeys, searchSubmit, reload } = useMenuConfigure();
</script>

<template>
  <n-card :bordered="false">
    <form-search
      inline
      :grid-props="{ cols: '1 s:1 m:2 l:3 xl:4 2xl:4' }"
      :show-reset-button="false"
      :show-advanced-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit" />
    <table-toolbar v-model:size="tableSize" :has-column-setting="false" @reload="reload">
      <template #tableTitle>
        <n-button type="primary" @click="addUpdateModelRef.init()">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template>
    </table-toolbar>
    <n-data-table
      v-model:expanded-row-keys="expandedRowKeys"
      :size="tableSize"
      :loading="tableLoading"
      :columns="columns"
      :data="tableData"
      :row-key="rowKey" />
    <menu-add-update-model ref="addUpdateModelRef" :table-data="tableData" />
  </n-card>
</template>
