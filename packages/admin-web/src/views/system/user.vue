<script lang="ts" setup>
  import { PlusOutlined } from '@/utils/icons';
  import FormSearch from '@/components/form/FormSearch.vue';
  import BasicTable from '@/components/table/BasicTable.vue';
  import UserAddUpdateModel from './components/UserAddUpdateModel.vue';
  import { useUserConfigure } from './hooks/useUserConfigure';

  const { addUpdateModelRef, actionRef, searchSchemas, columns, tableRowKey, searchSubmit, loadDataTable, reloadTable } = useUserConfigure();
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
    <basic-table ref="actionRef" is-card-surround :columns="columns" :request="loadDataTable" :row-key="tableRowKey">
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
    <user-add-update-model ref="addUpdateModelRef" @refresh="reloadTable" />
  </n-card>
</template>

<style lang="scss" scoped></style>
