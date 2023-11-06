import { computed, h, onMounted, ref, unref } from 'vue';
import { aliPayApi } from '@/api';
import { getBillMethodData, getBillTypeData, useApiType } from '@/hooks';
import { BasicColumn, TablePaginationParams } from '/#/components/table';
import { inflowOrOutflowMap, inflowOrOutflowOption } from '@/constant';
import { FormSchema } from '/#/components/form';
import { ApiAliPayItem, ApiAliPaySearchParams } from '/#/api/ali-pay';
import { CNumOption } from '/#/config';
import { BalanceDateRangeType } from '/#/views/money';
import { ApiStartEndTimeParams } from '/#/api/common';
import { NButton } from 'naive-ui';

//
export const useAliPayConfigure = () => {
  // 导入弹窗
  const uploadFileModelRef = ref<Component>();

  // 编辑弹窗
  const updateModelRef = ref<Component>();

  // 账单类型
  const { getBillTypeOption, getBillTypeMap, getBillMethodOption } = useApiType();

  /**
   * 表格
   *  */
  const actionRef = ref<Component>();
  // 获取接口数据
  const searchParams = ref<ApiAliPaySearchParams>({});
  const loadDataTable = async (pageParams: TablePaginationParams) => {
    return await aliPayApi.getPage({ ...searchParams.value, ...pageParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 表格key配置
  const tableRowKey = (row: ApiAliPayItem): string => row.aliPayId;

  // 查询配置
  const searchSchemas = computed<FormSchema[]>(() => [
    {
      field: 'tradeTime',
      component: 'NDatePicker',
      label: '交易时间',
      componentProps: {
        placeholder: '请输入交易时间',
        valueFormat: 'yyyy-MM-dd',
      },
    },
    {
      field: 'tradeOtherPerson',
      component: 'NInput',
      label: '交易对方',
      componentProps: {
        placeholder: '请输入交易对方',
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
        options: unref(getBillMethodOption),
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
  const columns = computed<BasicColumn<ApiAliPayItem>[]>(() => [
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
      render(row) {
        return '￥' + (row.moneyAmount || 0);
      },
    },
    {
      title: '余额(元)',
      key: 'balance',
      align: 'center',
      render(row) {
        return typeof row.balance === 'number' ? `￥${row.balance}` : '';
      },
    },
    {
      title: '余额宝(元)',
      key: 'balanceBaby',
      align: 'center',
      render(row) {
        return typeof row.balanceBaby === 'number' ? `￥${row.balanceBaby}` : '';
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
      title: '账单方式',
      key: 'billMethod',
      align: 'center',
      render(row) {
        const find = unref(getBillMethodOption).find((f: CNumOption) => f.value === row.billMethod);
        return find ? find.label : '';
      },
    },
    {
      title: '账单类型',
      key: 'billType',
      align: 'center',
      render(row) {
        return unref(getBillTypeMap)[row.billType] || '';
      },
    },
    {
      width: 150,
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'right',
      render(row: any) {
        return !!row.aliPayId
          ? h(
              NButton,
              {
                class: 'mh-3',
                text: true,
                type: 'primary',
                onClick: updateModelRef.value.init.bind(null, row),
              },
              {
                default: () => '修改',
              }
            )
          : '';
      },
    },
  ]);

  // 数据查询
  const searchSubmit = (values: ApiAliPaySearchParams) => {
    searchParams.value = values;
    actionRef.value.updatePage(1);
  };

  // 查询展开，更新表格高度
  const searchUnfold = () => {
    actionRef.value.debounceTableHeight();
  };

  // 处理余额弹窗
  const balanceTimeRef = ref<Component>();
  const handleBalance = () => {
    balanceTimeRef.value.init();
  };
  // 处理余额
  const btnBalanceLoading = ref(false);
  const balanceChange = (dateRange: BalanceDateRangeType) => {
    const params: ApiStartEndTimeParams = {
      startTime: '',
      endTime: '',
    };
    if (dateRange && dateRange.length > 0) {
      params.startTime = dateRange[0] + ' 00:00:00';
      params.endTime = dateRange[1] + ' 23:59:59';
    }
    btnBalanceLoading.value = true;
    aliPayApi
      .updateBalance(params)
      .then(() => {
        reloadTable();
      })
      .finally(() => {
        btnBalanceLoading.value = false;
      });
  };

  // 处理余额宝弹窗
  const balanceBodyTimeRef = ref();
  const handleBalanceBaby = () => {
    balanceBodyTimeRef.value.init();
  };
  // 处理余额宝
  const btnBalanceBabyLoading = ref(false);
  const balanceBodyChange = (dateRange: BalanceDateRangeType) => {
    const params: ApiStartEndTimeParams = {
      startTime: '',
      endTime: '',
    };
    if (dateRange && dateRange.length > 0) {
      params.startTime = dateRange[0] + ' 00:00:00';
      params.endTime = dateRange[1] + ' 23:59:59';
    }
    btnBalanceBabyLoading.value = true;
    aliPayApi
      .updateBalanceBaby(params)
      .then(() => {
        reloadTable();
      })
      .finally(() => {
        btnBalanceBabyLoading.value = false;
      });
  };

  onMounted(() => {
    getBillTypeData();
    getBillMethodData();
  });

  return {
    uploadFileModelRef,
    updateModelRef,
    searchSchemas,
    actionRef,
    columns,
    balanceTimeRef,
    btnBalanceLoading,
    balanceBodyTimeRef,
    btnBalanceBabyLoading,
    searchSubmit,
    searchUnfold,
    loadDataTable,
    reloadTable,
    tableRowKey,
    handleBalance,
    balanceChange,
    handleBalanceBaby,
    balanceBodyChange,
  };
};
