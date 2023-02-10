<template>
  <n-card :bordered="false" class="pro-card">
    <form-search
      inline
      :grid-props="{ cols: '1 s:1 m:2 l:3 xl:4 2xl:4' }"
      :show-reset-button="false"
      :show-advanced-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit"
    />
    <basic-table ref="actionRef" :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" :action-column="actionColumn" :scroll-x="1090">
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
    <add-update-model ref="addUpdateModelRef" @refurbish="reloadTable" />
  </n-card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { userApi } from '@/api';
  import { PlusOutlined } from '@/utils/icons';
  import FormSearch from '@/components/form/form-search.vue';
  import BasicTable from '@/components/Table/basic-table.vue';
  import { useConfigure } from './configure';
  import AddUpdateModel from './add-update-model.vue';

  const addUpdateModelRef = ref();

  /**
   * 表格
   *  */
  const actionRef = ref();
  // 获取接口数据
  const searchParams = ref({});
  const loadDataTable = async (tableParams) => {
    return await userApi.getPage({ ...searchParams.value, ...tableParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 配置
  const { searchSchemas, columns, actionColumn } = useConfigure({ reloadTable, addUpdateModelRef });

  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams.value = values;
    reloadTable();
  };
</script>
<style lang="scss" scoped></style>
