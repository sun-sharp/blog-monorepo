<script lang="ts" setup>
  import BasicTable from '@/components/table/BasicTable.vue';
  import FormSearch from '@/components/form/FormSearch.vue';
  import { useManualBillConfigure } from './hooks/useManualBillConfigure';
  import ManualBillAddUpdateModel from './components/ManualBillAddUpdateModel.vue';
  import { PlusOutlined } from '@/utils';

  const { searchSchemas, actionRef, columns, manualBillAddUpdateModelRef, searchSubmit, searchUnfold, loadDataTable, tableRowKey, reloadTable } =
    useManualBillConfigure();
</script>

<template>
  <n-card :bordered="false">
    <form-search
      inline
      :grid-props="{ cols: '1 s:2 m:3 l:4 xl:5 2xl:6' }"
      :show-reset-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit"
      @unfold="searchUnfold" />
    <basic-table ref="actionRef" is-card-surround :columns="columns" :request="loadDataTable" :row-key="tableRowKey">
      <template #tableTitle>
        <n-button type="primary" @click="manualBillAddUpdateModelRef.init()">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template>
    </basic-table>
    <manual-bill-add-update-model ref="manualBillAddUpdateModelRef" @refresh="reloadTable" />
  </n-card>
</template>
