<template>
  <n-card :bordered="false" class="proCard">
    <form-search inline :grid-props="{ cols: '1 s:1 m:2 l:3 xl:4 2xl:4' }" :show-reset-button="false" :schemas="searchSchemas" @submit="searchSubmit" />
    <basic-table
      ref="actionRef"
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row: Recordable) => row.imageId"
      :action-column="actionColumn"
      :scroll-x="1090"
    >
      <template #tableTitle>
        <n-button class="mr-10" type="success" @click="imageOnlyPublicModelRef.init()">处理只有图片文件的数据</n-button>
        <n-button type="primary" @click="imageNotUseModelRef.init()">查询未使用的图片</n-button>
      </template>
    </basic-table>
    <image-only-public-model ref="imageOnlyPublicModelRef" />
    <image-not-use-model ref="imageNotUseModelRef" @refresh="reloadTable" />
  </n-card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { imageApi } from '@/api';
  import BasicTable from '@/components/Table/basic-table.vue';
  import { imageConfigure } from './configure/image';
  import FormSearch from '@/components/form/form-search.vue';
  import ImageOnlyPublicModel from './components/image-only-public-model.vue';
  import ImageNotUseModel from './components/image-not-use-model.vue';

  // 处理只有图片文件的数据
  const imageOnlyPublicModelRef = ref();

  // 查询未使用的图片
  const imageNotUseModelRef = ref();

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

  // const onlyPublicImage = async () => {
  //   await imageApi.getOnlyPublic();
  // };
</script>
<style lang="scss" scoped></style>
