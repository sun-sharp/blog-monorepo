import { billMethodMap, billMethodOption, incomeOrPayMap, inflowOrOutflowMap, inflowOrOutflowOption } from '@/constant';
import { NRadio, NSelect, NSpace } from 'naive-ui';
import { h, reactive, unref, computed } from 'vue';
import TableAction from '@/components/Table/table-action.vue';

export const useConfigure = ({ updateModelRef, getBillTypeOption, getBillTypeMap }) => {
  // 查询配置
  const searchSchemas = computed(() => [
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
      field: 'billMethod',
      component: 'NSelect',
      label: '账单方式',
      componentProps: {
        filterable: true,
        placeholder: '请选择账单类型',
        options: billMethodOption,
      },
    },
    {
      field: 'billType',
      component: 'NSelect',
      label: '账单类型',
      componentProps: {
        filterable: true,
        placeholder: '请选择账单类型',
        options: unref(getBillTypeOption),
      },
    },
  ]);

  // 表格字段配置
  const columns = computed(() => [
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
      key: 'moneyAmount',
      align: 'center',
      render(row: any) {
        return '￥' + (row.moneyAmount || 0);
      },
    },
    {
      title: '余额(元)',
      key: 'balance',
      align: 'center',
      render(row: any) {
        return row.balance ? `￥${row.balance}` : '';
      },
    },
    {
      title: '余额宝(元)',
      key: 'balanceBaby',
      align: 'center',
      render(row: any) {
        return row.balanceBaby ? `￥${row.balanceBaby}` : '';
      },
    },
    {
      title: '流入/流出',
      key: 'inflowOrOutflow',
      align: 'center',
      render(row: any) {
        return inflowOrOutflowMap[row.inflowOrOutflow] || '';
      },
    },
    {
      title: '账单方式',
      key: 'billMethod',
      align: 'center',
      render(row: any) {
        return billMethodMap[row.billMethod] || '';
      },
    },
    {
      title: '账单类型',
      key: 'billType',
      align: 'center',
      render(row: any) {
        return unref(getBillTypeMap)[row.billType] || '';
      },
    },
  ]);

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
            ifShow: !!row.aliPayId,
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
export const uploadColumns = ({ getBillTypeOption }) => {
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
      title: '商品说明',
      key: 'productDescription',
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
      title: '收/付款方式',
      key: 'paymentMethod',
      align: 'center',
    },
    {
      title: '对方账号',
      key: 'oppositeAccount',
      align: 'center',
    },
    {
      title: '流入/流出',
      align: 'center',
      width: 170,
      render(row: any) {
        let inflowOrOutflow = incomeOrPayMap[row.incomeOrPay] || null;
        if (!inflowOrOutflow && ['余额宝-笔笔攒-单笔攒入'].includes(row.productDescription)) {
          inflowOrOutflow = 1;
        }
        row.inflowOrOutflow = inflowOrOutflow;
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
      title: '账单方式',
      align: 'center',
      width: 180,
      render(row: any) {
        return h(NSelect, {
          value: row.billMethod,
          filterable: true,
          placeholder: '请选择',
          options: billMethodOption,
          'on-update:value': (value: string) => (row.billMethod = value),
        });
      },
    },
    {
      title: '账单类型',
      align: 'center',
      width: 180,
      render(row: any) {
        return h(NSelect, {
          value: row.billType,
          filterable: true,
          placeholder: '请选择',
          options: unref(getBillTypeOption),
          'on-update:value': (value: string) => (row.billType = value),
        });
      },
    },
  ];
};
