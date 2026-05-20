import { getBillMethodData, getBillTypeData, useApiType } from '@/hooks';
import { computed, h, onMounted, ref, unref } from 'vue';
import { BasicColumn, TablePaginationParams } from '/#/components/table';
import { ApiWeChatItem, ApiWeChatSearchParams } from '/#/api/blog/money/we-chat';
import { weChatApi } from '@/api';
import { FormSchema } from '/#/components/form';
import { inflowOrOutflowMap, inflowOrOutflowOption } from '@/constant';
import { BalanceDateRangeType } from '/#/views/money';
import { ApiStartEndTimeParams } from '/#/api/common';
import { NButton } from 'naive-ui';
import { CNumOption } from '/#/common/config';

// 微信账单
export const useWeChatConfigure = () => {
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
  const searchParams = ref<ApiWeChatSearchParams>({});
  const loadDataTable = async (pageParams: TablePaginationParams) => {
    return await weChatApi.getPage({ ...searchParams.value, ...pageParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 表格key配置
  const tableRowKey = (row: ApiWeChatItem): string => row.weChatId;

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
  const columns = computed<BasicColumn<ApiWeChatItem>[]>(() => [
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
        return row.balance ? `￥${row.balance}` : '';
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
      render(row) {
        return row.weChatId
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
  const searchSubmit = (values: ApiWeChatSearchParams) => {
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
    weChatApi
      .updateBalance(params)
      .then(() => {
        reloadTable();
      })
      .finally(() => {
        btnBalanceLoading.value = false;
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
    balanceChange,
    handleBalance,
    searchSubmit,
    searchUnfold,
    loadDataTable,
    tableRowKey,
    reloadTable,
  };
};
