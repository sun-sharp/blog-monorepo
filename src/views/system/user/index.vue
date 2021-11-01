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
  import { h, reactive, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { getTableList } from '@/api/table/list';
  import { PlusOutlined } from '@vicons/antd';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { columns } from './columns';

  const message = useMessage();
  // 查询
  const searchSchemas = [
    {
      field: 'name',
      component: 'NInput',
      label: '姓名',
      componentProps: {
        placeholder: '请输入姓名',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];
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
  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '删除',
            icon: 'DeleteOutlined',
            type: 'error',
            // color: '#8a2be2',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow
            ifShow: () => {
              return true;
            },
          },
          {
            label: '编辑',
            type: 'primary',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
          },
        ],
        // 更多
        dropDownActions: [
          {
            label: '启用',
            key: 'enabled',
            // 根据业务控制是否显示: 非enable状态的不显示启用按钮
            ifShow: () => {
              return true;
            },
          },
          {
            label: '禁用',
            key: 'disabled',
            ifShow: () => {
              return true;
            },
          },
        ],
        select: (key) => {
          message.info(`您点击了，${key} 按钮`);
        },
      });
    },
  });

  // 新增/编辑弹窗
  const formParams = reactive({
    name: '',
    address: '',
    date: null,
  });
  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const modelSchemas = [
    {
      field: 'name',
      component: 'NInput',
      label: '名称',
      componentProps: {
        placeholder: '请输入名称',
        onInput: (e: any) => {
          console.log(e);
        },
      },
    },
  ];
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
  // 编辑
  const handleEdit = (record: Recordable) => {
    console.log('点击了编辑', record);
  };
  // 删除
  const handleDelete = (record: Recordable) => {
    console.log('点击了删除', record);
    message.info('点击了删除');
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
<style lang="scss" scoped>
  .result-box {
    width: 72%;
    margin: 0 auto;
    text-align: center;
    padding-top: 5px;

    &-extra {
      padding: 24px 40px;
      text-align: left;
      background: #f8f8f9;
      border-radius: 4px;
    }
  }
</style>
