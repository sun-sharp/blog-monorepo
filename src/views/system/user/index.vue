<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </BasicForm>
    <BasicTable ref="actionRef" :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" :scroll-x="1090" @update:checked-row-keys="onCheckedRow">
      <!-- <template #tableTitle>
        <n-button type="primary" @click="addTable">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建
        </n-button>
      </template> -->
    </BasicTable>
  </n-card>
</template>
<script lang="ts" setup>
  import { BasicTable } from '@/components/Table';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { columns } from './columns';
  import { getTableList } from '@/api/table/list';
  import { reactive, ref } from 'vue';
  // import { useMessage } from 'naive-ui';

  // const message = useMessage();
  const actionRef = ref();
  /* const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    fixed: 'right',
    // render(record) {
    //   return h(TableAction as any, {
    //     style: 'button',
    //     actions: [
    //       {
    //         label: '删除',
    //         icon: 'ic:outline-delete-outline',
    //         onClick: handleDelete.bind(null, record),
    //         // 根据业务控制是否显示 isShow 和 auth 是并且关系
    //         ifShow: () => {
    //           return true;
    //         },
    //         // 根据权限控制是否显示: 有权限，会显示，支持多个
    //         auth: ['basic_list'],
    //       },
    //       {
    //         label: '编辑',
    //         onClick: handleEdit.bind(null, record),
    //         ifShow: () => {
    //           return true;
    //         },
    //         auth: ['basic_list'],
    //       },
    //     ],
    //     dropDownActions: [
    //       {
    //         label: '启用',
    //         key: 'enabled',
    //         // 根据业务控制是否显示: 非enable状态的不显示启用按钮
    //         ifShow: () => {
    //           return true;
    //         },
    //       },
    //       {
    //         label: '禁用',
    //         key: 'disabled',
    //         ifShow: () => {
    //           return true;
    //         },
    //       },
    //     ],
    //     select: (key) => {
    //       message.info(`您点击了，${key} 按钮`);
    //     },
    //   });
    // },
  }); */

  const schemas = [
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

  const [register, {}] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
    showAdvancedButton: false,
    showResetButton: false,
  });

  const formParams = reactive({
    name: '',
    address: '',
    date: null,
  });
  const params = ref({
    pageSize: 5,
    name: 'xiaoMa',
  });

  // 获取接口数据
  const loadDataTable = async (res) => {
    return await getTableList({ ...formParams, ...params.value, ...res });
  };

  /* // 编辑
  const handleEdit = (record: Recordable) => {
    console.log('点击了编辑', record);
  };

  // 删除
  const handleDelete = (record: Recordable) => {
    console.log('点击了删除', record);
    message.info('点击了删除');
  }; */

  // 选择行
  const onCheckedRow = (rowKeys) => {
    console.log(rowKeys);
  };

  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };

  // 表单查询
  const handleSubmit = (values: Recordable) => {
    console.log(values);
    reloadTable();
  };

  // 表单重置
  const handleReset = (values: Recordable) => {
    console.log(values);
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
