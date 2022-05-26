import { NRadio, NSelect, NSpace } from 'naive-ui';
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

// 收入/支出
const weChatIncomeOrPayMap = {
  收入: 1,
  支出: 2,
};

// 交易类型
// const weChatTradeTypeMap = {
//   微信红包: 52,
//   企业微信红包: 52,
// };

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
    label: '消费-超市',
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
    label: '消费-水果',
  },
  {
    value: 11,
    label: '聚餐-AA',
  },
  {
    value: 15,
    label: '借出',
  },
  {
    value: 21,
    label: '红包支出',
  },
  {
    value: 31,
    label: '交通-火车',
  },
  {
    value: 32,
    label: '交通-单车',
  },
  {
    value: 33,
    label: '交通-大巴',
  },
  {
    value: 34,
    label: '交通-打车',
  },
  {
    value: 35,
    label: '交通-油费',
  },
  {
    value: 36,
    label: '交通-地铁',
  },
  {
    value: 41,
    label: '吃-自做',
  },
  {
    value: 42,
    label: '吃-熟食',
  },
  {
    value: 61,
    label: 'vip会员',
  },
  {
    value: 51,
    label: '退还1',
  },
  {
    value: 52,
    label: '红包收入1',
  },
  {
    value: 53,
    label: '充值1',
  },
  {
    value: 102,
    label: '退还',
  },
  {
    value: 103,
    label: '红包收入',
  },
  {
    value: 104,
    label: '基本工资',
  },
  {
    value: 105,
    label: '奖金',
  },
  {
    value: 101,
    label: '无效账单1',
  },
  {
    value: 1001,
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
    // {
    //   title: '交易对方备注',
    //   width: 150,
    //   render(row: any) {
    //     return h(NInput, {
    //       value: row.tradeOtherPersonRemarks,
    //       type: 'text',
    //       placeholder: '请输入',
    //       'on-update:value': (value: string | [string, string]) => (row.tradeOtherPersonRemarks = value),
    //     });
    //   },
    // },
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
        row.inflowOrOutflow = weChatIncomeOrPayMap[row.incomeOrPay] || null;
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
    // {
    //   title: '账单说明',
    //   width: 180,
    //   render(row: any) {
    //     return h(NInput, {
    //       value: row.explain,
    //       type: 'textarea',
    //       rows: 2,
    //       placeholder: '请输入',
    //       'on-update:value': (value: string | [string, string]) => (row.explain = value),
    //     });
    //   },
    // },
    // {
    //   title: '使用地点',
    //   width: 180,
    //   render(row: any) {
    //     return h(NInput, {
    //       value: row.place,
    //       type: 'textarea',
    //       rows: 2,
    //       placeholder: '请输入',
    //       'on-update:value': (value: string | [string, string]) => (row.place = value),
    //     });
    //   },
    // },
    {
      title: '账单类型',
      width: 180,
      render(row: any) {
        return h(NSelect, {
          value: row.billType,
          // multiple: true,
          placeholder: '请选择',
          options: weChatBillTypeOption,
          'on-update:value': (value: string) => (row.billType = value),
        });
      },
    },
  ];
};
