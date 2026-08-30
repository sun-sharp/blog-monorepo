import { computed, h, onMounted, ref, unref } from 'vue';
import { manualBillApi } from '@/api';
import { getBillMethodData, getBillTypeData, useApiType } from '@/hooks';
import { BasicColumn, TablePaginationParams } from '/#/components/table';
import { FormSchema } from '/#/components/form';
import { inflowOrOutflowMap, inflowOrOutflowOption, manualPaymentMethodMap, manualPaymentMethodOption } from '@/constant';
import { ApiManualBillItem, ApiManualBillSearchParams } from '/#/api/blog/money/manual-bill';
import { NButton, NPopconfirm } from 'naive-ui';

// 手写账单
export const useManualBillConfigure = () => {
  // 新增、编辑弹窗
  const manualBillAddUpdateModelRef = ref<Component>();

  // 账单类型
  const { getBillTypeOption, getBillMethodOption } = useApiType();

  /**
   * 表格
   */
  const actionRef = ref<Component>();
  // 获取接口数据
  const searchParams = ref<ApiManualBillSearchParams>({});
  const loadDataTable = async (pageParams: TablePaginationParams) => {
    return await manualBillApi.getPage({ ...searchParams.value, ...pageParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 表格key配置
  const tableRowKey = (row: ApiManualBillItem): string => row.manualBillId;

  // 查询配置
  const searchSchemas = computed<FormSchema[]>(() => [
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
      field: 'manualPaymentMethod',
      component: 'NSelect',
      label: '支付方式',
      componentProps: {
        placeholder: '请选择支付方式',
        options: manualPaymentMethodOption,
      },
    },
    {
      field: 'billMethod',
      component: 'NSelect',
      label: '账单方式',
      componentProps: {
        filterable: true,
        placeholder: '请选择账单方式',
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

  // 删除
  const handleDelete = (row: ApiManualBillItem) => {
    manualBillApi.remove(row.manualBillId).then(() => {
      reloadTable();
    });
  };

  // 表格字段配置
  const columns = computed<BasicColumn<ApiManualBillItem>[]>(() => [
    {
      title: '交易时间',
      key: 'tradeTime',
      align: 'center',
      width: 170,
    },
    {
      title: '交易对方',
      key: 'tradeOtherPerson',
      align: 'center',
    },
    {
      title: '交易金额',
      key: 'moneyAmount',
      align: 'center',
      render(row) {
        return '￥' + (row.moneyAmount || 0);
      },
    },
    {
      title: '支付方式',
      key: 'manualPaymentMethod',
      align: 'center',
      render(row) {
        return row.manualPaymentMethod ? manualPaymentMethodMap[row.manualPaymentMethod] : '';
      },
    },
    {
      title: '余额',
      key: 'balance',
      align: 'center',
      render(row) {
        return typeof row.balance === 'number' ? `￥${row.balance}` : '';
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
      title: '说明',
      key: 'explain',
      align: 'center',
    },
    {
      title: '交易场所',
      key: 'place',
      align: 'center',
    },
    {
      title: '账单方式',
      key: 'billMethod',
      align: 'center',
      render(row) {
        const find = unref(getBillMethodOption).find((f) => f.value === row.billMethod);
        return find ? find.label : '';
      },
    },
    {
      title: '账单类型',
      key: 'billType',
      align: 'center',
      render(row) {
        const find = unref(getBillTypeOption).find((f) => f.value === row.billType);
        return find ? find.label : '';
      },
    },
    {
      width: 200,
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'right',
      render(row) {
        return row.manualBillId
          ? [
              h(
                NButton,
                { class: 'mh-3', type: 'primary', text: true, onClick: manualBillAddUpdateModelRef.value.init.bind(null, row) },
                { default: () => '修改' }
              ),
              h(
                NPopconfirm,
                { negativeText: null, onPositiveClick: handleDelete.bind(null, row) },
                {
                  trigger: () => h(NButton, { class: 'mh-3', type: 'error', text: true }, { default: () => '删除' }),
                  default: () => '是否确定删除',
                }
              ),
            ]
          : '';
      },
    },
  ]);

  // 数据查询
  const searchSubmit = (values: ApiManualBillSearchParams) => {
    searchParams.value = values;
    actionRef.value.updatePage(1);
  };

  // 查询展开，更新表格高度
  const searchUnfold = () => {
    actionRef.value.debounceTableHeight();
  };

  onMounted(() => {
    getBillTypeData();
    getBillMethodData();
  });

  return {
    manualBillAddUpdateModelRef,
    searchSchemas,
    actionRef,
    columns,
    searchSubmit,
    searchUnfold,
    loadDataTable,
    tableRowKey,
    reloadTable,
  };
};
