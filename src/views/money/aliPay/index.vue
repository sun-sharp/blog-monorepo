<script lang="ts" setup>
  import BasicTable from '@/components/table/BasicTable.vue';
  import FormSearch from '@/components/form/FormSearch.vue';
  import AliPayUploadFileModel from './components/AliPayUploadFileModel.vue';
  import BalanceTimeSelect from '@/views/money/components/BalanceTimeSelect.vue';
  import AliPayUpdateModel from './components/AliPayUpdateModel.vue';
  import { useAliPayConfigure } from './hooks/useAliPayConfigure';
  import { UploadOutlined } from '@/utils';

  const {
    uploadFileModelRef,
    updateModelRef,
    searchSchemas,
    actionRef,
    columns,
    balanceTimeRef,
    btnBalanceLoading,
    balanceBodyTimeRef,
    btnBalanceBabyLoading,
    searchSubmit,
    searchUnfold,
    loadDataTable,
    reloadTable,
    tableRowKey,
    handleBalance,
    balanceChange,
    handleBalanceBaby,
    balanceBodyChange,
  } = useAliPayConfigure();
</script>

<template>
  <n-card :bordered="false">
    <form-search
      inline
      :grid-props="{ cols: '1 s:2 m:3 l:4 xl:5 2xl:6' }"
      :show-reset-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit"
      @unfold="searchUnfold"
    />
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
          <n-button :loading="btnBalanceLoading" type="info" @click="handleBalance">处理余额</n-button>
          <n-button :loading="btnBalanceBabyLoading" type="info" @click="handleBalanceBaby">处理余额宝</n-button>
        </n-space>
      </template>
    </basic-table>
    <ali-pay-upload-file-model ref="uploadFileModelRef" @refresh="reloadTable" />
    <ali-pay-update-model ref="updateModelRef" @refresh="reloadTable" />
    <balance-time-select ref="balanceTimeRef" @balanceChange="balanceChange" />
    <balance-time-select ref="balanceBodyTimeRef" @balanceChange="balanceBodyChange" />
  </n-card>
</template>
