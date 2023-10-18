<script lang="ts" setup>
  import FormSearch from '@/components/form/FormSearch.vue';
  import BasicTable from '@/components/table/BasicTable.vue';
  import { UploadOutlined } from '@/utils';
  import BankUploadFileModel from './components/BankUploadFileModel.vue';
  import BankUpdateModel from './components/BankUpdateModel.vue';
  import { useBankConfigure } from './hooks/useBankConfigure';

  const { uploadFileModelRef, searchSchemas, actionRef, columns, updateModelRef, loadDataTable, reloadTable, searchSubmit, tableRowKey } = useBankConfigure();
</script>

<template>
  <n-card :bordered="false">
    <form-search
      inline
      :grid-props="{ cols: '1 s:2 m:3 l:3 xl:4 2xl:5' }"
      :show-reset-button="false"
      :show-advanced-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit"
    />
    <basic-table ref="actionRef" pagination :columns="columns" :request="loadDataTable" :row-key="tableRowKey">
      <template #tableTitle>
        <n-button type="success" @click="uploadFileModelRef.init()">
          <template #icon>
            <n-icon>
              <UploadOutlined />
            </n-icon>
          </template>
          导入
        </n-button>
      </template>
    </basic-table>
    <bank-upload-file-model ref="uploadFileModelRef" @refresh="reloadTable" />
    <bank-update-model ref="updateModelRef" @refurbish="reloadTable" />
  </n-card>
</template>
