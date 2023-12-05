<script lang="ts" setup>
  import BasicTable from '@/components/table/BasicTable.vue';
  import FormSearch from '@/components/form/FormSearch.vue';
  import ImageOnlyPublicModel from './components/ImageOnlyPublicModel.vue';
  import ImageNotUseModel from './components/ImageNotUseModel.vue';
  import { useImageConfigure } from './hooks/useImageConfigure';

  // 配置
  const { imageOnlyPublicModelRef, imageNotUseModelRef, searchSchemas, actionRef, columns, searchSubmit, loadDataTable, tableRowKey, reloadTable } =
    useImageConfigure();
</script>

<template>
  <n-card :bordered="false">
    <form-search
      inline
      :grid-props="{ cols: '1 s:1 m:2 l:3 xl:4 2xl:4' }"
      :show-reset-button="false"
      :show-advanced-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit"
    />
    <basic-table ref="actionRef" :columns="columns" :request="loadDataTable" :row-key="tableRowKey" :scroll-x="1090">
      <template #tableTitle>
        <n-button class="mr-10" type="success" @click="imageOnlyPublicModelRef.init()">处理只有图片文件的数据</n-button>
        <n-button type="primary" @click="imageNotUseModelRef.init()">查询未使用的图片</n-button>
      </template>
    </basic-table>
    <image-only-public-model ref="imageOnlyPublicModelRef" />
    <image-not-use-model ref="imageNotUseModelRef" @refresh="reloadTable" />
  </n-card>
</template>
