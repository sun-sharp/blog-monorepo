<template>
  <n-card :bordered="false" class="proCard">
    <basic-form @register="searchRegister" @submit="searchSubmit">
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </basic-form>
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
  import { BasicTable } from '@/components/Table';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { useConfigure } from './configure';
  import AddUpdateModel from './AddUpdateModel.vue';

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

  /**
   * 查询
   *  */
  const [searchRegister, {}] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas: searchSchemas,
    showResetButton: false,
  });
  // 数据查询
  const searchSubmit = (values: Recordable) => {
    searchParams.value = values;
    reloadTable();
  };
</script>
<style lang="scss" scoped></style>
