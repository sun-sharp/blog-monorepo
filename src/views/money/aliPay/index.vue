<template>
  <n-card :bordered="false" class="pro-card">
    <form-search inline :grid-props="{ cols: '1 s:2 m:3 l:4 xl:5 2xl:6' }" :show-reset-button="false" :schemas="searchSchemas" @submit="searchSubmit" />
    <basic-table ref="actionRef" pagination :columns="columns" :request="loadDataTable" :row-key="(row: any) => row.id" :action-column="actionColumn">
      <template #tableTitle>
        <n-space>
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
        </n-space>
      </template>
    </basic-table>
    <upload-file-model ref="uploadFileModelRef" @refresh="reloadTable" />
    <update-model ref="updateModelRef" @refurbish="reloadTable" />
  </n-card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { aliPayApi } from '@/api';
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
  const loadDataTable = async (tableParams) => {
    return await aliPayApi.getPage({ ...searchParams.value, ...tableParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 配置
  const { searchSchemas, actionColumn, columns } = useConfigure({ updateModelRef });

  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams.value = values;
    actionRef.value.updatePage(1);
  };

  // 处理余额
  const btnBalanceLoading = ref(false);
  const handleBalance = () => {
    btnBalanceLoading.value = true;
    aliPayApi
      .updateBalance()
      .then(() => {
        reloadTable();
      })
      .finally(() => {
        btnBalanceLoading.value = false;
      });
  };

  // 处理余额宝
  const btnBalanceBabyLoading = ref(false);
  const handleBalanceBaby = () => {
    btnBalanceBabyLoading.value = true;
    aliPayApi
      .updateBalanceBaby()
      .then(() => {
        reloadTable();
      })
      .finally(() => {
        btnBalanceBabyLoading.value = false;
      });
  };
</script>
<style lang="scss" scoped></style>
