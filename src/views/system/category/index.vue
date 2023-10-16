<script lang="ts" setup>
  import FormSearch from '@/components/form/FormSearch.vue';
  import { useCategoryConfigure } from './hooks/useCategoryConfigure';
  import BasicTable from '@/components/table/BasicTable.vue';
  import CategoryAddUpdate from './components/CategoryAddUpdate.vue';
  import { PlusOutlined } from '@/utils';

  // 配置
  const { categoryAddUpdateRef, searchSchemas, columns, loadDataTable, reloadTable, searchSubmit } = useCategoryConfigure();
</script>

<template>
  <n-card class="category-card" :bordered="false">
    <form-search
      inline
      :grid-props="{ cols: '1 s:2 m:3 l:3 xl:4 2xl:5' }"
      :show-reset-button="false"
      :show-advanced-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit"
    />
    <basic-table ref="actionRef" :columns="columns" is-card-surround :request="loadDataTable" :row-key="(row: any) => row.id">
      <template #tableTitle>
        <n-button type="primary" @click="categoryAddUpdateRef.init()">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template>
    </basic-table>
    <category-add-update ref="categoryAddUpdateRef" @refurbish="reloadTable" />
  </n-card>
</template>
