<script lang="ts" setup>
  import BasicTable from '@/components/table/BasicTable.vue';
  import FormSearch from '@/components/form/FormSearch.vue';
  import { useBillUploadConfigure } from './hooks/useBillUploadConfigure';
  import BillUploadAddUpdateModel from './components/BillUploadAddUpdateModel.vue';
  import { PlusOutlined } from '@/utils';

  const { searchSchemas, actionRef, columns, billUploadAddUpdateModelRef, searchSubmit, searchUnfold, loadDataTable, tableRowKey, reloadTable } =
    useBillUploadConfigure();
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
        <n-button type="primary" @click="billUploadAddUpdateModelRef.init()">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template>
    </basic-table>
    <bill-upload-add-update-model ref="billUploadAddUpdateModelRef" @refresh="reloadTable" />
  </n-card>
</template>
