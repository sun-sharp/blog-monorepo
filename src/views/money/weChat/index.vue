<script lang="ts" setup>
  import BasicTable from '@/components/table/BasicTable.vue';
  import FormSearch from '@/components/form/FormSearch.vue';
  import WeChatUploadFileModel from './components/WeChatUploadFileModel.vue';
  import BalanceTimeSelect from '@/views/money/components/BalanceTimeSelect.vue';
  import WeChatUpdateModel from './components/WeChatUpdateModel.vue';
  import { useWeChatConfigure } from './hooks/useWeChatConfigure';
  import { UploadOutlined } from '@/utils';

  const {
    uploadFileModelRef,
    updateModelRef,
    searchSchemas,
    actionRef,
    columns,
    balanceTimeRef,
    btnBalanceLoading,
    balanceChange,
    handleBalance,
    searchSubmit,
    loadDataTable,
    reloadTable,
    tableRowKey,
  } = useWeChatConfigure();
</script>

<template>
  <n-card :bordered="false">
    <form-search inline :grid-props="{ cols: '1 s:2 m:3 l:4 xl:5 2xl:6' }" :show-reset-button="false" :schemas="searchSchemas" @submit="searchSubmit" />
    <basic-table ref="actionRef" is-card-surround :columns="columns" :request="loadDataTable" :row-key="tableRowKey">
      <template #tableTitle>
        <n-space>
          <n-button type="success" @click="uploadFileModelRef.init()">
            <template #icon>
              <n-icon>
                <UploadOutlined />
              </n-icon>
            </template>
            导入
          </n-button>
          <n-button :loading="btnBalanceLoading" type="info" @click="handleBalance">处理零钱余额</n-button>
        </n-space>
      </template>
    </basic-table>
    <we-chat-upload-file-model ref="uploadFileModelRef" @refresh="reloadTable" />
    <we-chat-update-model ref="updateModelRef" @refurbish="reloadTable" />
    <balance-time-select ref="balanceTimeRef" @balanceChange="balanceChange" />
  </n-card>
</template>
