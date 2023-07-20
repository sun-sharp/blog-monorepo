<script lang="ts" setup>
  import FormSearch from '@/components/form/form-search.vue';
  import { useCategoryConfigure } from './categoryConfigure';
  import { ref } from 'vue';
  import BasicTable from '@/components/Table/basic-table.vue';
  import { categoryApi } from '@/api';
  import CategoryAddUpdate from './CategoryAddUpdate.vue';
  import { PlusOutlined } from '@/utils';

  const categoryAddUpdateRef = ref();

  /**
   * 表格
   *  */
  const actionRef = ref();
  // 获取接口数据
  const searchParams = ref({});
  const loadDataTable = async (tableParams: any) => {
    return await categoryApi.getPage({ ...searchParams.value, ...tableParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };

  // 配置
  const { searchSchemas, columns, actionColumn } = useCategoryConfigure();

  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams.value = values;
    actionRef.value.updatePage(1);
  };
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
    <basic-table ref="actionRef" pagination :columns="columns" :request="loadDataTable" :row-key="(row: any) => row.id" :action-column="actionColumn">
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
