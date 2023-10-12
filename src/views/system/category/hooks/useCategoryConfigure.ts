import { reactive, computed } from 'vue';
import { FormSchema } from '/#/components/form';
import { BasicColumn } from '/#/components/table';
// import TableAction from '@/components/Table/table-action.vue';

export const useCategoryConfigure = () => {
  // 查询配置
  const searchSchemas = computed<FormSchema[]>(() => [
    {
      field: 'type',
      component: 'NInput',
      label: '全局类型分类',
      labelWidth: 110,
      componentProps: {
        placeholder: '请输入全局类型分类',
      },
    },
  ]);

  // 表格字段配置
  const columns = computed<BasicColumn[]>(() => [
    {
      title: '全局类型分类',
      key: 'type',
      align: 'center',
      width: 170,
    },
    {
      title: '全局类型标识',
      key: 'value',
      align: 'center',
    },
    {
      title: '全局类型标识（字符串类型）',
      key: 'valueStr',
      align: 'center',
    },
    {
      title: '全局类型名称',
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
