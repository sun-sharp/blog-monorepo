import { reactive, computed } from 'vue';
// import TableAction from '@/components/Table/table-action.vue';

export const useCategoryConfigure = () => {
  // 查询配置
  const searchSchemas = computed(() => [
    {
      field: 'name',
      component: 'NInput',
      label: '交易对方',
      componentProps: {
        placeholder: '请输入昵称',
      },
    },
  ]);

  // 表格字段配置
  const columns = computed(() => [
    {
      title: '分类类型',
      key: 'type',
      align: 'center',
      width: 170,
    },
    {
      title: '分类标识',
      key: 'value',
      align: 'center',
    },
    {
      title: '分类标识(字符串类型)',
      key: 'valueStr',
      align: 'center',
    },
    {
      title: '分类名称',
      key: 'label',
      align: 'center',
    },
  ]);

  const actionColumn = reactive({
    // width: 150,
    // title: '操作',
    // key: 'action',
    // align: 'center',
    // fixed: 'right',
    // render(row: any) {
    //   return h(TableAction as any, {
    //     style: 'button',
    //     actions: [
    //       {
    //         ifShow: !!row.aliPayId,
    //         label: '修改',
    //         type: 'primary',
    //         text: true,
    //         onClick: updateModelRef.value.init.bind(null, row),
    //       },
    //     ],
    //   });
    // },
  });

  return {
    searchSchemas,
    columns,
    actionColumn,
  };
};
