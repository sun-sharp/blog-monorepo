<template>
  <n-card :bordered="false" class="pro-card">
    <form-search
      inline
      :grid-props="{ cols: '1 s:2 m:3 l:3 xl:4 2xl:5' }"
      :show-reset-button="false"
      :show-advanced-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit"
    />
    <basic-table ref="actionRef" pagination :columns="columns" :request="loadDataTable" :row-key="(row: any) => row.bankId" :action-column="actionColumn">
      <template #tableTitle>
        <n-button type="success" @click="uploadFileModelRef.init()">
          <template #icon>
            <n-icon>
              <UploadOutlined />
            </n-icon>
          </template>
          导入
        </n-button>
      </template>
    </basic-table>
    <upload-file-model ref="uploadFileModelRef" @refresh="reloadTable" />
    <update-model ref="updateModelRef" @refurbish="reloadTable" />
  </n-card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { bankApi } from '@/api';
  import FormSearch from '@/components/form/form-search.vue';
  import BasicTable from '@/components/Table/basic-table.vue';
  import { useConfigure } from './configure';
  import { UploadOutlined } from '@/utils';
  import UploadFileModel from './upload-file-model.vue';
  import UpdateModel from './update-model.vue';

  // 导入弹窗
  const uploadFileModelRef = ref();

  // 编辑弹窗
  const updateModelRef = ref();

  /**
   * 表格
   *  */
  const actionRef = ref();
  // 获取接口数据
  const searchParams = ref({});
  const loadDataTable = async (tableParams: any) => {
    return await bankApi.getPage({ ...searchParams.value, ...tableParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 配置
  const { searchSchemas, actionColumn, columns } = useConfigure({ reloadTable, updateModelRef });

  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams.value = values;
    reloadTable();
  };
</script>
<style lang="scss" scoped></style>
