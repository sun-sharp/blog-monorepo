<template>
  <n-card :bordered="false" class="proCard">
    <form-search inline :grid-props="{ cols: '1 s:1 m:2 l:3 xl:4 2xl:4' }" :show-reset-button="false" :schemas="searchSchemas" @submit="searchSubmit" />
    <basic-table ref="actionRef" :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" :scroll-x="1090">
      <template #tableTitle>
        <n-button>
          <template #icon>
            <n-icon>
              <UploadOutlined />
            </n-icon>
          </template>
          导入
        </n-button>
      </template>
    </basic-table>
  </n-card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { weChatApi } from '@/api';
  import FormSearch from '@/components/form/form-search.vue';
  import BasicTable from '@/components/Table/basic-table.vue';
  import { useConfigure } from './configure';
  import { UploadOutlined } from '@/utils';

  /**
   * 表格
   *  */
  const actionRef = ref();
  // 获取接口数据
  const searchParams = ref({});
  const loadDataTable = async (tableParams) => {
    return await weChatApi.getPage({ ...searchParams.value, ...tableParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 配置
  const { searchSchemas, columns } = useConfigure();

  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams.value = values;
    reloadTable();
  };
</script>
<style lang="scss" scoped></style>
