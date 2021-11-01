<template>
  <n-card :bordered="false" class="proCard">
    <basic-form @register="searchRegister" @submit="searchSubmit" @reset="searchReset">
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </basic-form>
    <basic-table
      ref="actionRef"
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      :action-column="actionColumn"
      :scroll-x="1090"
      @update:checked-row-keys="onCheckedRow"
    >
      <template #tableTitle>
        <n-button type="primary" @click="showModal = true">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template>
    </basic-table>
    <n-modal v-model:show="showModal" class="w-600" :show-icon="false" preset="dialog" title="新建">
      <basic-form @register="modelRegister">
        <template #statusSlot="{ model, field }">
          <n-input v-model:value="model[field]" />
        </template>
      </basic-form>

      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getTableList } from '@/api/table/list';
  import { PlusOutlined } from '@vicons/antd';
  import { useMessage } from 'naive-ui';
  import { BasicTable } from '@/components/Table';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { useConfigure } from './configure';

  // 配置
  const message = useMessage();
  const { searchSchemas, columns, actionColumn, modelSchemas } = useConfigure({ message });

  // 查询
  const [searchRegister, {}] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas: searchSchemas,
    showAdvancedButton: false,
    showResetButton: false,
  });
  const params = ref({
    pageSize: 5,
    name: 'xiaoMa',
  });

  // 表格
  const actionRef = ref();

  // 新增/编辑弹窗
  const formParams = reactive({
    name: '',
    address: '',
    date: null,
  });
  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const [modelRegister, {}] = useForm({
    gridProps: { cols: '1' },
    labelWidth: 80,
    schemas: modelSchemas,
    layout: 'screen',
    showAdvancedButton: false,
    showResetButton: false,
    showSubmitButton: false,
  });

  /**
   * 表格
   *  */
  // 获取接口数据
  const loadDataTable = async (res) => {
    return await getTableList({ ...formParams, ...params.value, ...res });
  };
  // 选择行
  const onCheckedRow = (rowKeys) => {
    console.log(rowKeys);
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };

  /**
   * 查询
   *  */
  // 数据查询
  const searchSubmit = (values: Recordable) => {
    console.log(values);
    reloadTable();
  };
  // 数据重置
  const searchReset = (values: Recordable) => {
    console.log(values);
  };

  /**
   * 弹窗
   *  */
  const confirmForm = (e) => {
    e.preventDefault();
    formBtnLoading.value = true;
    // formRef.value.validate((errors) => {
    //   if (!errors) {
    //     message.success('新建成功');
    //     setTimeout(() => {
    //       showModal.value = false;
    //       reloadTable();
    //     });
    //   } else {
    //     message.error('请填写完整信息');
    //   }
    //   formBtnLoading.value = false;
    // });
  };
</script>
<style lang="scss" scoped></style>
