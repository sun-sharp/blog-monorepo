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
