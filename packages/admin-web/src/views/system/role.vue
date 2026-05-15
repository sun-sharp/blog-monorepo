<script lang="ts" setup>
  import { PlusOutlined } from '@/utils';
  import BasicTable from '@/components/table/BasicTable.vue';
  import FormSearch from '@/components/form/FormSearch.vue';
  import AddUpdateModel from './components/RoleAddUpdateModel.vue';
  import { useRoleConfigure } from './hooks/useRoleConfigure';

  // 配置
  const { addUpdateModelRef, searchSchemas, actionRef, columns, searchSubmit, loadDataTable, reloadTable, tableRowKey } = useRoleConfigure();
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
    <add-update-model ref="addUpdateModelRef" @refresh="reloadTable" />
  </n-card>
</template>

<style lang="scss" scoped></style>
