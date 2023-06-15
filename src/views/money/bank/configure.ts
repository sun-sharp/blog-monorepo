import { incomeOrPayMap, inflowOrOutflowMap, inflowOrOutflowOption, voucherTypeMap } from '@/constant';
import { NRadio, NSelect, NSpace } from 'naive-ui';
import { h, reactive } from 'vue';
import TableAction from '@/components/Table/table-action.vue';
import { bankApi } from '@/api';
import { computed } from 'vue';
import { unref } from 'vue';
import { COption } from '/#/config';

export const useConfigure = ({ reloadTable, updateModelRef, getBillTypeOption, getBillTypeMap, getBankTypeOption }) => {
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
      field: 'bankType',
      component: 'NSelect',
      label: '银行类型',
      labelWidth: 110,
      componentProps: {
        filterable: true,
        placeholder: '请选择银行类型',
        options: unref(getBankTypeOption),
      },
    },
    {
      field: 'bankBillType',
      component: 'NSelect',
      label: '银行账单类型',
      labelWidth: 110,
      componentProps: {
        filterable: true,
        placeholder: '请选择银行账单类型',
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
      title: '银行类型',
      key: 'bankType',
      align: 'center',
      render(row: any) {
        const find = unref(getBankTypeOption).find((f: COption) => f.value === row.bankType);
        return find ? find.label : '';
      },
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
      title: '交易金额',
      key: 'moneyAmount',
      align: 'center',
      render(row: any) {
        return '￥' + (row.moneyAmount || 0);
      },
    },
    {
      title: '余额',
      key: 'balance',
      align: 'center',
      render(row: any) {
        return '￥' + (row.balance || 0);
      },
    },
    {
      title: '银行账单类型',
      key: 'bankBillType',
      align: 'center',
      render(row: any) {
        return unref(getBillTypeMap)[row.bankBillType] || '';
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
  ]);

  // 删除表格数据
  const handleDelete = (bankId: string) => {
    bankApi.remove(bankId).then(() => {
      reloadTable();
    });
  };

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
            ifShow: !!row.bankId,
            label: '修改',
            type: 'primary',
            text: true,
            onClick: updateModelRef.value.init.bind(null, row),
          },
          {
            ifShow: !!row.bankId,
            label: '删除',
            type: 'error',
            text: true,
            onClick: handleDelete.bind(null, row.bankId),
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
export const uploadColumns = ({ getBillTypeOption, getBankTypeOption }) => {
  return computed(() => [
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
      title: '银行类型',
      align: 'center',
      render(row: any) {
        const find = unref(getBankTypeOption).find((f: COption) => f.value === row.bankType);
        return find ? find.label : '';
      },
    },
    {
      title: '凭证类型',
      align: 'center',
      render(row: any) {
        return voucherTypeMap[row.voucherType] || '';
      },
    },
    {
      title: '凭证号码',
      key: 'voucherNo',
      align: 'center',
    },
    {
      title: '交易对方',
      key: 'tradeOtherPerson',
      align: 'center',
    },
    // {
    //   title: '交易对方账号',
    //   key: 'tradeOtherPersonAccount',
    //   align: 'center',
    // },
    {
      title: '交易对方备注',
      key: 'tradeOtherPersonRemarks',
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
      title: '余额',
      align: 'center',
      render(row: any) {
        return '￥' + (row.balance || 0);
      },
    },
    {
      title: '账单说明',
      key: 'explain',
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
      title: '银行账单类型',
      width: 180,
      render(row: any) {
        return h(NSelect, {
          value: row.bankBillType,
          filterable: true,
          placeholder: '请选择',
          options: unref(getBillTypeOption),
          'on-update:value': (value: string) => (row.bankBillType = value),
        });
      },
    },
  ]);
};
