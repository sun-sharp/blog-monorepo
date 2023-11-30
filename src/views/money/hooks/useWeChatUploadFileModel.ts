import { computed, h, ref, unref } from 'vue';
import { ApiWeChatBase, ApiWeChatBatchSaveItem } from '/#/api/we-chat';
import { useApiType } from '@/hooks';
import { BasicColumn } from '/#/components/table';
import { inflowOrOutflowOption } from '@/constant';
import { NRadio, NSelect, NSpace, SelectOption } from 'naive-ui';
import { weChatApi } from '@/api';
import { getUploadWeCharAction } from '@/utils';

// 微信账单批量导入 弹窗
export const useWeChatUploadFileModel = (emit: (event: 'refresh', ...args: any[]) => void) => {
  const showModal = ref<boolean>(false);
  const tableData = ref<ApiWeChatBatchSaveItem[]>([]);
  const excelUploadTotal = ref<number>(0);
  const btnDisabled = computed<boolean>(() => {
    return tableData.value.length === 0 || tableData.value.filter((f) => !f.inflowOrOutflow || !f.billMethod || !f.billType).length !== 0;
  });
  // 获取账单类型
  const { getBillTypeOption, getBillMethodOption } = useApiType();

  const columns = computed<BasicColumn<ApiWeChatBatchSaveItem>[]>(() => [
    {
      title: '序号',
      align: 'center',
      key: 'index',
      width: 60,
      render(_row, rowIdx: number) {
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
      key: 'moneyAmount',
      render(row) {
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
      key: 'inflowOrOutflow',
      width: 170,
      render(row) {
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
      key: 'billMethod',
      width: 180,
      render(row) {
        return h(NSelect, {
          value: row.billMethod,
          filterable: true,
          placeholder: '请选择',
          options: unref(getBillMethodOption) as SelectOption[],
          'on-update:value': (value: number) => (row.billMethod = value),
        });
      },
    },
    {
      title: '账单类型',
      align: 'center',
      key: 'billType',
      width: 180,
      render(row) {
        return h(NSelect, {
          value: row.billType,
          filterable: true,
          placeholder: '请选择',
          options: unref(getBillTypeOption) as SelectOption[],
          'on-update:value': (value: number) => (row.billType = value),
        });
      },
    },
  ]);
  const uploadFileList = ref([]);

  // 重新刷新
  const reload = () => {
    tableData.value = [];
    uploadFileList.value = [];
    excelUploadTotal.value = 0;
  };

  // 初始化
  const init = async () => {
    showModal.value = true;
    reload();
  };

  // 表格样式
  const rowClassName = (row: ApiWeChatBatchSaveItem) => {
    return ![1, 2].includes(row.inflowOrOutflow || 0) || !row.billMethod || !row.billType ? 'bg-red-td' : '';
  };

  // 保存列表数据
  const btnLoading = ref(false);
  const confirmForm = () => {
    btnLoading.value = true;
    weChatApi
      .batchSave({
        batches: tableData.value,
      })
      .then(() => {
        showModal.value = false;
        emit('refresh');
      })
      .finally(() => {
        btnLoading.value = false;
      });
  };

  // 账单上传成功
  const excelUploadChange = (data: ApiWeChatBase) => {
    const uploadTableData = data;
    excelUploadTotal.value = tableData.value.concat(uploadTableData).length;
    tableData.value = tableData.value.concat(uploadTableData).slice(0, 50);
  };

  const modalTitle = computed(() => {
    return '导入微信账单' + `(${tableData.value.length}/${excelUploadTotal.value})`;
  });
  return {
    modalTitle,
    showModal,
    btnDisabled,
    tableData,
    rowClassName,
    excelUploadTotal,
    columns,
    uploadAction: getUploadWeCharAction(),
    uploadFileList,
    btnLoading,
    init,
    reload,
    confirmForm,
    excelUploadChange,
  };
};
