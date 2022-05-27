import { billTypeMap, billTypeOption, incomeOrPayMap, inflowOrOutflowMap, inflowOrOutflowOption } from '@/constant';
import { NRadio, NSelect, NSpace } from 'naive-ui';
import { h, reactive } from 'vue';
import TableAction from '@/components/Table/table-action.vue';

export const useConfigure = ({ updateModelRef }) => {
  // 查询配置
  const searchSchemas = [
    {
      field: 'tradeOtherPerson',
      component: 'NInput',
      label: '交易对方',
      componentProps: {
        placeholder: '请输入昵称',
      },
    },
    {
      field: 'inflowOrOutflow',
      component: 'NSelect',
      label: '流入/流出',
      componentProps: {
        placeholder: '请选择流入/流出',
        options: inflowOrOutflowOption,
      },
    },
    {
      field: 'billType',
      component: 'NSelect',
      label: '账单类型',
      componentProps: {
        filterable: true,
        placeholder: '请选择账单类型',
        options: billTypeOption,
      },
    },
  ];

  // 表格字段配置
  const columns = [
    {
      title: '交易时间',
      key: 'tradeTime',
      align: 'center',
      width: 170,
    },
    {
      title: '交易类型',
      key: 'tradeType',
      align: 'center',
    },
    {
      title: '交易对方',
      key: 'tradeOtherPerson',
      align: 'center',
    },
    {
      title: '交易对方备注',
      key: 'tradeOtherPersonRemarks',
      align: 'center',
    },
    {
      title: '金额(元)',
      align: 'center',
      render(row: any) {
        return '￥' + (row.moneyAmount || 0);
      },
    },
    {
      title: '账单类型',
      align: 'center',
      render(row: any) {
        return billTypeMap[row.billType] || '';
      },
    },
    {
      title: '流入/流出',
      align: 'center',
      render(row: any) {
        return inflowOrOutflowMap[row.inflowOrOutflow] || '';
      },
    },
  ];

  const actionColumn = reactive({
    width: 150,
    title: '操作',
    key: 'action',
    align: 'center',
    fixed: 'right',
    render(row: any) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            ifShow: !!row.weChatId,
            label: '修改',
            type: 'primary',
            text: true,
            onClick: updateModelRef.value.init.bind(null, row),
          },
        ],
      });
    },
  });

  return {
    searchSchemas,
    columns,
    actionColumn,
  };
};

// 导入表格字段配置
export const uploadColumns = () => {
  return [
    {
      title: '序号',
      align: 'center',
      width: 60,
      render(_row: any, rowIdx: number) {
        return rowIdx + 1;
      },
    },
    {
      title: '交易时间',
      key: 'tradeTime',
      align: 'center',
      width: 170,
    },
    {
      title: '交易类型',
      key: 'tradeType',
      align: 'center',
    },
    {
      title: '交易对方',
      key: 'tradeOtherPerson',
      align: 'center',
    },
    {
      title: '商品',
      key: 'goods',
      align: 'center',
    },
    {
      title: '收/支',
      key: 'incomeOrPay',
      align: 'center',
      width: 70,
    },
    {
      title: '金额(元)',
      align: 'center',
      render(row: any) {
        return '￥' + (row.moneyAmount || 0);
      },
    },
    {
      title: '支付方式',
      key: 'paymentMethod',
      align: 'center',
    },
    {
      title: '当前状态',
      key: 'currentStatus',
      align: 'center',
    },
    {
      title: '备注',
      key: 'remarks',
      align: 'center',
    },
    {
      title: '流入/流出',
      align: 'center',
      width: 170,
      render(row: any) {
        row.inflowOrOutflow = incomeOrPayMap[row.incomeOrPay] || null;
        return h(
          NSpace,
          {
            justify: 'center',
          },
          {
            default: () =>
              inflowOrOutflowOption.map((m) =>
                h(
                  NRadio,
                  {
                    checked: row.inflowOrOutflow === m.value,
                    value: m.value,
                    name: 'inflow-outflow',
                    'on-update:checked': (checked: boolean) => {
                      if (checked) row.inflowOrOutflow = m.value;
                    },
                  },
                  {
                    default: () => m.label,
                  }
                )
              ),
          }
        );
      },
    },
    {
      title: '账单类型',
      width: 180,
      render(row: any) {
        return h(NSelect, {
          value: row.billType,
          filterable: true,
          placeholder: '请选择',
          options: billTypeOption,
          'on-update:value': (value: string) => (row.billType = value),
        });
      },
    },
  ];
};
