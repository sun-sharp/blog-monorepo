<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { articleAPi } from '@/api';
  import { PlusOutlined } from '@/utils';
  import { useConfigure } from './configure';
  import FormSearch from '@/components/form/form-search.vue';
  import BasicTable from '@/components/Table/basic-table.vue';

  const props = defineProps({
    categoryOptions: {
      type: Array,
      default: () => [],
    },
  });
  const emit = defineEmits(['addChange', 'editChange']);

  /**
   * 表格
   *  */
  const actionRef = ref();
  // 获取接口数据
  const searchParams = ref({});
  const loadDataTable = async (tableParams: any) => {
    return await articleAPi.getFindPage({ ...searchParams.value, ...tableParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 配置
  // 查询配置
  const searchSchemas = computed(() => [
    {
      field: 'title',
      component: 'NInput',
      label: '文章标题',
      componentProps: {
        placeholder: '请输入文章标题',
      },
    },
    {
      field: 'categoryVal',
      component: 'NSelect',
      label: '文章分类',
      componentProps: {
        defaultValue: '',
        clearable: false,
        placeholder: '请选择文章分类',
        options: [{ value: '', label: '全部' }].concat(JSON.parse(JSON.stringify(props.categoryOptions))),
      },
    },
  ]);
  const { columns, actionColumn } = useConfigure({ reloadTable, emit });

  /**
   * 查询
   *  */
  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams.value = values;
    reloadTable();
  };

  defineExpose({
    searchSubmit,
  });
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
