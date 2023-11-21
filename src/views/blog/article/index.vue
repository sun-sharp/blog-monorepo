<script lang="ts" setup>
  import { useArticleConfigure } from './hooks/useArticleConfigure';
  import { PlusOutlined } from '@/utils';
  import FormSearch from '@/components/form/FormSearch.vue';
  import BasicTable from '@/components/table/BasicTable.vue';
  import ArticleAddUpdateModel from './components/ArticleAddUpdateModel.vue';

  const { actionRef, addUpdateModelRef, searchSchemas, columns, searchSubmit, loadDataTable, tableRowKey, reloadTable } = useArticleConfigure();
</script>

<template>
  <n-card :bordered="false">
    <form-search
      inline
      :grid-props="{ cols: '1 s:1 m:2 l:3 xl:4 2xl:4' }"
      :show-reset-button="false"
      :show-advanced-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit"
    />
    <basic-table ref="actionRef" is-card-surround :columns="columns" :request="loadDataTable" :row-key="tableRowKey" :scroll-x="1090">
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
    </basic-table>
    <article-add-update-model ref="addUpdateModelRef" @finished="reloadTable" />
  </n-card>
</template>
