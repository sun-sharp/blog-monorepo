<script lang="ts" setup>
  import FormSearch from '@/components/form/form-search.vue';
  import { useCategoryConfigure } from './categoryConfigure';
  import { ref } from 'vue';
  import BasicTable from '@/components/Table/basic-table.vue';
  import { categoryApi } from '@/api';

  /**
   * 表格
   *  */
  const actionRef = ref();
  // 获取接口数据
  const searchParams = ref({});
  const loadDataTable = async (tableParams: any) => {
    return await categoryApi.getPage({ ...searchParams.value, ...tableParams });
  };
  // // 刷新数据
  // const reloadTable = () => {
  //   actionRef.value.reload();
  // };

  // 配置
  const { searchSchemas, columns, actionColumn } = useCategoryConfigure();

  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams.value = values;
    actionRef.value.updatePage(1);
  };
</script>

<template>
  <n-card :bordered="false" class="pro-card">
    <form-search
      inline
      :grid-props="{ cols: '1 s:2 m:3 l:4 xl:5 2xl:6' }"
      :show-reset-button="false"
      :show-advanced-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit"
    />
    <basic-table ref="actionRef" pagination :columns="columns" :request="loadDataTable" :row-key="(row: any) => row.id" :action-column="actionColumn">
      <template #tableTitle>
        <!-- <n-space>
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
        </n-space> -->
      </template>
    </basic-table>
  </n-card>
</template>
