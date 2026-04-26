import { computed, h, onMounted, ref, unref } from 'vue';
import { FormSchema } from '/#/components/form';
import { ApiBillUploadItem, ApiBillUploadSearchParams } from '/#/api/blog/bill-upload';
import { BasicColumn, TablePaginationParams } from '/#/components/table';
import { billUploadApi } from '@/api';
import { getBillTypeData, getBillMethodData, useApiType } from '@/hooks';
import { NButton, NPopconfirm } from 'naive-ui';
import { billUploadTypeMap, handleTypeMap, billUploadTypeOption, inflowOrOutflowMap, judgeWayOption, handleTypeOption } from '@/constant';

// 微信账单
export const useBillUploadConfigure = () => {
  // 新增、编辑弹窗
  const billUploadAddUpdateModelRef = ref<Component>();

  // 账单类型
  const { getBillTypeOption, getBillMethodOption } = useApiType();

  /**
   * 表格
   *  */
  const actionRef = ref<Component>();
  // 获取接口数据
  const searchParams = ref<ApiBillUploadSearchParams>({});
  const loadDataTable = async (pageParams: TablePaginationParams) => {
    return await billUploadApi.getPage({ ...searchParams.value, ...pageParams });
  };
  // 刷新数据
  const reloadTable = () => {
    actionRef.value.reload();
  };
  // 表格key配置
  const tableRowKey = (row: ApiBillUploadItem): string => row.billUploadId;

  // 查询配置
  const searchSchemas = computed<FormSchema[]>(() => {
    const arr: FormSchema[] = [
      {
        field: 'billUploadType',
        component: 'NSelect',
        label: '账单导入类型',
        labelWidth: 110,
        componentProps: {
          filterable: true,
          placeholder: '请选择账单导入类型',
          options: billUploadTypeOption,
        },
      },
      {
        field: 'handleType',
        component: 'NSelect',
        label: '需处理类型',
        labelWidth: 110,
        componentProps: {
          filterable: true,
          placeholder: '请选择需处理类型',
          options: handleTypeOption,
          'onUpdate:value': (val: string) => {
            searchParams.value.handleType = val;
          },
        },
      },
    ];
    // 添加账单类型查询
    if (searchParams.value.handleType === 'billType') {
      arr.push({
        field: 'billType',
        component: 'NSelect',
        label: '账单类型',
        labelWidth: 110,
        componentProps: {
          filterable: true,
          placeholder: '请选择账单类型',
          options: unref(getBillTypeOption),
        },
      });
    }
    // 添加账单方式查询
    else if (searchParams.value.handleType === 'billMethod') {
      arr.push({
        field: 'billMethod',
        component: 'NSelect',
        label: '账单方式',
        labelWidth: 110,
        componentProps: {
          filterable: true,
          placeholder: '请选择账单方式',
          options: unref(getBillMethodOption),
        },
      });
    }
    arr.push({
      field: 'judgeWay',
      component: 'NSelect',
      label: '账单导入方式',
      labelWidth: 110,
      componentProps: {
        filterable: true,
        placeholder: '请选择账单导入方式',
        options: unref(judgeWayOption),
      },
    });
    return arr;
  });

  // 删除
  const handleDelete = (row: ApiBillUploadItem) => {
    billUploadApi.remove(row.billUploadId).then(() => {
      reloadTable();
    });
  };

  // 表格字段配置
  const columns = computed<BasicColumn<ApiBillUploadItem>[]>(() => [
    {
      title: '账单导入类型',
      key: 'billUploadType',
      align: 'center',
      render(row) {
        return billUploadTypeMap[row.billUploadType] || '';
      },
    },
    {
      title: '需处理类型',
      key: 'handleType',
      align: 'center',
      render(row) {
        return handleTypeMap[row.handleType] || '';
      },
    },
    {
      title: '流入/流出',
      key: 'inflowOrOutflow',
      align: 'center',
      render(row) {
        return row.inflowOrOutflow ? inflowOrOutflowMap[row.inflowOrOutflow] : '';
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
      title: '账单方式',
      key: 'billMethod',
      align: 'center',
      render(row) {
        const find = unref(getBillMethodOption).find((f) => f.value === row.billMethod);
        return find ? find.label : '';
      },
    },
    {
      title: '账单导入字段',
      key: 'billJudgeKey',
      align: 'center',
    },
    {
      title: '账单导入方式',
      key: 'judgeWay',
      align: 'center',
    },
    {
      width: 150,
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'right',
      render(row) {
        return row.billUploadId
          ? [
              h(
                NButton,
                {
                  class: 'mh-3',
                  type: 'primary',
                  text: true,
                  onClick: billUploadAddUpdateModelRef.value.init.bind(null, row),
                },
                {
                  default: () => '修改',
                }
              ),
              h(
                NPopconfirm,
                {
                  negativeText: null,
                  onPositiveClick: handleDelete.bind(null, row),
                },
                {
                  trigger: () =>
                    h(
                      NButton,
                      {
                        class: 'mh-3',
                        type: 'error',
                        text: true,
                      },
                      {
                        default: () => '删除',
                      }
                    ),
                  default: () => '是否确定删除',
                }
              ),
            ]
          : '';
      },
    },
  ]);

  // 数据查询
  const searchSubmit = (values: ApiBillUploadSearchParams) => {
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
    billUploadAddUpdateModelRef,
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
