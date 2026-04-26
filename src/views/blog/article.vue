<script lang="ts" setup>
  import { useArticleConfigure } from './hooks/useArticleConfigure';
  import { PlusOutlined } from '@/utils';
  import FormSearch from '@/components/form/FormSearch.vue';
  import BasicTable from '@/components/table/BasicTable.vue';
  import ArticleAddUpdateModel from './components/ArticleAddUpdateModel.vue';

  const {
    actionRef,
    addUpdateModelRef,
    searchSchemas,
    columns,
    checkedRowKeysDisabled,
    privateBtnDisabled,
    notPrivateBtnDisabled,
    searchSubmit,
    loadDataTable,
    tableRowKey,
    reloadTable,
    tableCheckedRowKeys,
    privateChange,
    notPrivateChange,
  } = useArticleConfigure();
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
    <basic-table
      ref="actionRef"
      is-card-surround
      :columns="columns"
      :request="loadDataTable"
      :row-key="tableRowKey"
      :scroll-x="1090"
      has-selection
      @update:checked-row-keys="tableCheckedRowKeys">
      <template #tableTitle>
        <n-space>
          <n-button type="primary" @click="addUpdateModelRef.init()">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新建
          </n-button>
          <n-button :disabled="checkedRowKeysDisabled || privateBtnDisabled" type="success" @click="privateChange">加密</n-button>
          <n-button :disabled="checkedRowKeysDisabled || notPrivateBtnDisabled" type="success" @click="notPrivateChange">不加密</n-button>
        </n-space>
      </template>
    </basic-table>
    <article-add-update-model ref="addUpdateModelRef" @finished="reloadTable" />
  </n-card>
</template>
