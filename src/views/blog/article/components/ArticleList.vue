<script lang="ts" setup>
  import { PlusOutlined } from '@/utils';
  import FormSearch from '@/components/form/FormSearch.vue';
  import BasicTable from '@/components/table/BasicTable.vue';
  import { useArticleList } from '../hooks/useArticleList';

  const emit = defineEmits(['addChange', 'editChange']);

  const { searchSchemas, columns, actionRef, searchSubmit, loadDataTable, tableRowKey, reloadTable } = useArticleList(emit);

  defineExpose({ reloadTable });
</script>

<template>
  <div>
    <form-search
      inline
      :grid-props="{ cols: '1 s:1 m:2 l:3 xl:4 2xl:4' }"
      :show-reset-button="false"
      :show-advanced-button="false"
      :schemas="searchSchemas"
      @submit="searchSubmit"
    />
    <basic-table ref="actionRef" is-card-surround :columns="columns" :request="loadDataTable" :row-key="tableRowKey" :scroll-x="1090">
      <template #tableTitle>
        <n-button type="primary" @click="emit('addChange')">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template>
    </basic-table>
  </div>
</template>
