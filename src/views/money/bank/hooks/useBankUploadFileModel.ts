import { useApiType } from '@/hooks';
import { computed, h, ref, unref } from 'vue';
import { BasicColumn } from '/#/components/table';
import { ApiBankBase, ApiBankBatchSaveItem } from '/#/api/bank';
import { CNumOption } from '/#/config';
import { incomeOrPayMap, inflowOrOutflowOption, voucherTypeMap } from '@/constant';
import { NRadio, NSelect, NSpace, SelectOption } from 'naive-ui';
import { bankApi } from '@/api';
import { getUploadBankAction } from '@/utils';

// 银行账单批量导入 弹窗
export const useBankUploadFileModel = (emit: (event: 'refresh', ...args: any[]) => void) => {
  const showModal = ref<boolean>(false);
  const tableData = ref<ApiBankBatchSaveItem[]>([]);
  const excelUploadTotal = ref<number>(0);
  const btnDisabled = computed<boolean>(() => {
    return tableData.value.length === 0 || tableData.value.filter((f) => !f.inflowOrOutflow || !f.bankBillType).length !== 0;
  });

  // 获取账单类型
  const { getBillTypeOption, getBankTypeOption } = useApiType();

  const columns = computed<BasicColumn<ApiBankBatchSaveItem>[]>(() => [
    {
      title: '序号',
      align: 'center',
      key: 'index',
      width: 60,
      render(_row, rowIdx) {
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
      key: 'bankType',
      render(row) {
        const find = unref(getBankTypeOption).find((f: CNumOption) => f.value === row.bankType);
        return find ? find.label : '';
      },
    },
    {
      title: '凭证类型',
      align: 'center',
      key: 'voucherType',
      render(row) {
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
      key: 'moneyAmount',
      render(row) {
        return '￥' + (row.moneyAmount || 0);
      },
    },
    {
      title: '余额',
      align: 'center',
      key: 'balance',
      render(row) {
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
      key: 'inflowOrOutflow',
      render(row) {
        row.inflowOrOutflow = incomeOrPayMap[row.incomeOrPay];
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
      key: 'bankBillType',
      render(row) {
        return h(NSelect, {
          value: row.bankBillType,
          filterable: true,
          placeholder: '请选择',
          options: unref(getBillTypeOption) as SelectOption[],
          'on-update:value': (value: number) => (row.bankBillType = value),
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
  const rowClassName = (row: ApiBankBatchSaveItem) => {
    return ![1, 2].includes(row.inflowOrOutflow || 0) || !row.bankBillType || !row.bankType ? 'bg-red-td' : '';
  };

  // 保存列表数据
  const btnLoading = ref(false);
  const confirmForm = () => {
    btnLoading.value = true;
    bankApi
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
  const excelUploadChange = (data: ApiBankBase) => {
    excelUploadTotal.value = tableData.value.concat(data).length;
    tableData.value = tableData.value.concat(data).slice(0, 100);
  };

  const modalTitle = computed(() => {
    return '导入银行账单' + `(${tableData.value.length}/${excelUploadTotal.value})`;
  });
  return {
    modalTitle,
    showModal,
    btnDisabled,
    tableData,
    rowClassName,
    excelUploadTotal,
    columns,
    uploadAction: getUploadBankAction(),
    uploadFileList,
    btnLoading,
    init,
    reload,
    confirmForm,
    excelUploadChange,
  };
};
