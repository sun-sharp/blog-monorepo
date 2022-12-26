<script lang="ts" setup>
  import { ref } from 'vue';
  import { articleAPi } from '@/api';
  import { PlusOutlined } from '@/utils';
  import { useConfigure } from './configure';
  import FormSearch from '@/components/form/form-search.vue';
  import BasicTable from '@/components/Table/basic-table.vue';

  const emit = defineEmits(['changeShowType']);

  /**
   * 表格
   *  */
  const actionRef = ref();
  // 获取接口数据
  const searchParams = ref({});
  const loadDataTable = async (tableParams: any) => {
    return await articleAPi.getFindPage({ ...searchParams.value, tableParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 配置
  const { searchSchemas, columns, actionColumn } = useConfigure({ reloadTable });

  /**
   * 查询
   *  */
  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams.value = values;
    reloadTable();
  };
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
    <basic-table ref="actionRef" :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" :action-column="actionColumn" :scroll-x="1090">
      <template #tableTitle>
        <n-button type="primary" @click="emit('changeShowType', 'add')">
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
