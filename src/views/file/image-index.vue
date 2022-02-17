<template>
  <n-card :bordered="false" class="proCard">
    <app-search-form
      inline
      :grid-props="{ cols: '1 s:1 m:2 l:3 xl:4 2xl:4' }"
      :show-reset-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit"
    ></app-search-form>
    <basic-table
      ref="actionRef"
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      :action-column="actionColumn"
      :scroll-x="1090"
    ></basic-table>
  </n-card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { imageApi } from '@/api';
  import { BasicTable } from '@/components/Table';
  import { imageConfigure } from './configure/image';
  import AppSearchForm from '@/components/app-search-form.vue';

  /**
   * 表格
   *  */
  const actionRef = ref();
  // 获取接口数据
  const searchParams = ref({});
  const loadDataTable = async (tableParams) => {
    return await imageApi.getPage({ ...searchParams.value, ...tableParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 配置
  const { searchSchemas, columns, actionColumn } = imageConfigure({ reloadTable });

  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams.value = values;
    reloadTable();
  };
</script>
<style lang="scss" scoped></style>
