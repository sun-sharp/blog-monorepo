<template>
  <n-card :bordered="false" class="proCard">
    <basic-form @register="searchRegister" @submit="searchSubmit" @reset="searchReset">
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
    <add-update-model ref="addUpdateModelRef" @refurbish="loadDataTable" />
  </n-card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { getRolePage } from '@/api';
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
    return await getRolePage({ ...searchParams.value, ...tableParams });
  };
  // 配置
  const { searchSchemas, columns, actionColumn } = useConfigure({ loadDataTable, addUpdateModelRef });
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };

  /**
   * 查询
   *  */
  const [searchRegister, {}] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas: searchSchemas,
    showAdvancedButton: false,
    showResetButton: false,
  });
  // 数据查询
  const searchSubmit = (values: Recordable) => {
    console.log(values);
    reloadTable();
  };
  // 数据重置
  const searchReset = (values: Recordable) => {
    console.log(values);
  };
</script>
<style lang="scss" scoped></style>
