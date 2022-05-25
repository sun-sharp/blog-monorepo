import { NInput, NRadio, NSelect, NSpace } from 'naive-ui';
import { h } from 'vue';

const weChatInflowOrOutflowOption = [
  {
    value: 1,
    label: '流入',
  },
  {
    value: 2,
    label: '流出',
  },
];

// 账单类型
const weChatBillTypeOption = [
  {
    value: 1,
    label: '消费-吃',
  },
  {
    value: 2,
    label: '消费-衣',
  },
  {
    value: 3,
    label: '消费-生活',
  },
  {
    value: 4,
    label: '消费-住宿',
  },
  {
    value: 5,
    label: '消费-交通',
  },
  {
    value: 6,
    label: '借出',
  },
  {
    value: 21,
    label: '退还',
  },
  {
    value: 22,
    label: '红包收入',
  },
  {
    value: 23,
    label: '充值',
  },
  {
    value: 101,
    label: '无效账单',
  },
];

export const useConfigure = () => {
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
  ];

  // 表格字段配置
  const columns = [
    {
      title: '交易时间',
      key: 'tradeTime',
      align: 'center',
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
      title: '收/支',
      key: 'incomeOrPay',
      align: 'center',
    },
    {
      title: '金额(元)',
      key: 'moneyAmount',
      align: 'center',
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
  ];

  return {
    searchSchemas,
    columns,
  };
};

// 导入表格字段配置
export const uploadColumns = () => {
  return [
    {
      title: '序号',
      align: 'center',
      width: 80,
      render(_row: any, rowIdx: number) {
        return rowIdx + 1;
      },
    },
    {
      title: '交易时间',
      key: 'tradeTime',
      align: 'center',
      width: 180,
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
      width: 150,
      render(row: any) {
        return h(NInput, {
          value: row.tradeOtherPersonRemarks,
          type: 'text',
          placeholder: '请输入',
          'on-update:value': (value: string | [string, string]) => (row.tradeOtherPersonRemarks = value),
        });
      },
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
    },
    {
      title: '金额(元)',
      key: 'moneyAmount',
      align: 'center',
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
        return h(
          NSpace,
          {
            justify: 'center',
          },
          {
            default: () =>
              weChatInflowOrOutflowOption.map((m) =>
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
      title: '账单说明',
      width: 180,
      render(row: any) {
        return h(NInput, {
          value: row.explain,
          type: 'textarea',
          rows: 2,
          placeholder: '请输入',
          'on-update:value': (value: string | [string, string]) => (row.explain = value),
        });
      },
    },
    {
      title: '使用地点',
      width: 180,
      render(row: any) {
        return h(NInput, {
          value: row.place,
          type: 'textarea',
          rows: 2,
          placeholder: '请输入',
          'on-update:value': (value: string | [string, string]) => (row.place = value),
        });
      },
    },
    {
      title: '账单类型',
      width: 180,
      render(row: any) {
        return h(NSelect, {
          value: row.billType,
          multiple: true,
          placeholder: '请选择',
          options: weChatBillTypeOption,
          'on-update:value': (value: string) => (row.billType = value),
        });
      },
    },
  ];
};
