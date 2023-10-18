import { getBankTypeData, getBillTypeData, useApiType } from '@/hooks';
import { computed, h, onMounted, ref, unref } from 'vue';
import { FormSchema } from '/#/components/form';
import { BasicColumn, TablePaginationParams } from '/#/components/table';
import { ApiBankItem, ApiBankSearchParams } from '/#/api/bank';
import { CNumOption } from '/#/config';
import { inflowOrOutflowMap, inflowOrOutflowOption } from '@/constant';
import { NButton } from 'naive-ui';
import { bankApi } from '@/api';

// 银行账单管理
export const useBankConfigure = () => {
  // 导入弹窗
  const uploadFileModelRef = ref<Component>();

  // 编辑弹窗
  const updateModelRef = ref<Component>();

  // 获取账单类型
  const { getBillTypeOption, getBillTypeMap, getBankTypeOption } = useApiType();

  const searchSchemas = computed<FormSchema[]>(() => [
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

  /**
   * 表格
   *  */
  const actionRef = ref<Component>();
  // 获取接口数据
  const searchParams = ref<ApiBankSearchParams>({});
  const loadDataTable = async (pageParams: TablePaginationParams) => {
    return await bankApi.getPage({ ...searchParams.value, ...pageParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 表格key配置
  const tableRowKey = (row: ApiBankItem): string => row.bankId;

  // 删除表格数据
  const handleDelete = (bankId: string) => {
    bankApi.remove(bankId).then(() => {
      reloadTable();
    });
  };
  // 表格字段配置
  const columns = computed<BasicColumn<ApiBankItem>[]>(() => [
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
      render(row) {
        const find = unref(getBankTypeOption).find((f: CNumOption) => f.value === row.bankType);
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
      render(row) {
        return '￥' + (row.balance || 0);
      },
    },
    {
      title: '银行账单类型',
      key: 'bankBillType',
      align: 'center',
      render(row) {
        return unref(getBillTypeMap)[row.bankBillType] || '';
      },
    },
    {
      title: '流入/流出',
      key: 'inflowOrOutflow',
      align: 'center',
      render(row) {
        return inflowOrOutflowMap[row.inflowOrOutflow] || '';
      },
    },
    {
      width: 150,
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'right',
      render(row) {
        return !!row.bankId
          ? [
              h(
                NButton,
                {
                  class: 'mh-3',
                  type: 'primary',
                  text: true,
                  onClick: updateModelRef.value.init.bind(null, row),
                },
                {
                  default: () => '修改',
                }
              ),
              h(
                NButton,
                {
                  class: 'mh-3',
                  type: 'error',
                  text: true,
                  onClick: handleDelete.bind(null, row.bankId),
                },
                {
                  default: () => '删除',
                }
              ),
            ]
          : '';
      },
    },
  ]);

  // 数据查询
  const searchSubmit = (values: ApiBankSearchParams) => {
    searchParams.value = values;
    actionRef.value.updatePage(1);
  };

  onMounted(() => {
    getBillTypeData();
    getBankTypeData();
  });

  return {
    uploadFileModelRef,
    searchSchemas,
    actionRef,
    columns,
    updateModelRef,
    loadDataTable,
    reloadTable,
    searchSubmit,
    tableRowKey,
  };
};
