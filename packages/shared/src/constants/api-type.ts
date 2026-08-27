import { arrEnumToObj } from '../utils/array';

export const MAIN_DIRECTORY_VALUE: number = 1;

export const MENU_VALUE: number = 5;

export const EMBEDDED_VALUE: number = 6;

export const OUTSIDE_THE_CHAIN_VALUE: number = 7;

export const menuTypeOption = [
  {
    value: MAIN_DIRECTORY_VALUE,
    label: '目录',
    tagTypeName: 'info',
  },
  {
    value: MENU_VALUE,
    label: '菜单',
    tagTypeName: 'success',
  },
  {
    value: EMBEDDED_VALUE,
    label: '内嵌',
    tagTypeName: 'warning',
  },
  {
    value: OUTSIDE_THE_CHAIN_VALUE,
    label: '外链',
    tagTypeName: 'error',
  },
];
export const menuTypeObj = arrEnumToObj(menuTypeOption);

export const menuTagTypeNameObj = arrEnumToObj(
  menuTypeOption,
  'value',
  'tagTypeName',
);

export const roleTypeOption = [
  {
    value: 1,
    label: '全部权限',
  },
  {
    value: 2,
    label: '自定义权限',
  },
];
export const roleTypeObj = arrEnumToObj(roleTypeOption);

export const inflowOrOutflowOption = [
  {
    value: 1,
    label: '流入',
  },
  {
    value: 2,
    label: '流出',
  },
];
export const inflowOrOutflowMap = arrEnumToObj(inflowOrOutflowOption);

export const voucherTypeOption = [
  {
    value: 1,
    label: '存折',
  },
  {
    value: 2,
    label: '储蓄卡',
  },
  {
    value: 3,
    label: '信用卡',
  },
];
export const voucherTypeMap = arrEnumToObj(voucherTypeOption);

export const categoryTypeEnum: { [x: string]: string } = {
  moneyBillType: 'money_bill_type',
  moneyBankType: 'money_bank_type',
  moneyBillMethod: 'money_bill_method',
  capitalImageSource: 'capital_image_source',
  capitalWaitForDoClassify: 'capital_wait-for-do_classify',
  blogArticleCategory: 'blog_article_category',
};

export const categoryTypeOption = Object.keys(categoryTypeEnum).map((key) => ({
  value: categoryTypeEnum[key],
  label: categoryTypeEnum[key],
}));

export const weChatBillUploadType = 1;
export const aliPayBillUploadType = 2;
export const bankBillUploadType = 3;
export const billUploadTypeOption = [
  {
    value: weChatBillUploadType,
    label: '微信账单',
  },
  {
    value: aliPayBillUploadType,
    label: '支付宝账单',
  },
  {
    value: bankBillUploadType,
    label: '银行账单',
  },
];
export const billUploadTypeMap = arrEnumToObj(billUploadTypeOption);

export const handleTypeOption = [
  {
    value: 'inflowOrOutflow',
    label: '流入/流出',
  },
  {
    value: 'billType',
    label: '账单类型',
  },
  {
    value: 'billMethod',
    label: '账单方式',
  },
];
export const handleTypeMap = arrEnumToObj(handleTypeOption);

export const weChatBillJudgeOptions = [
  {
    value: 'tradeType',
    label: '交易类型',
  },
  {
    value: 'tradeOtherPerson',
    label: '交易对方',
  },
  {
    value: 'goods',
    label: '商品',
  },
  {
    value: 'incomeOrPay',
    label: '收/支',
  },
  {
    value: 'paymentMethod',
    label: '支付方式',
  },
  {
    value: 'currentStatus',
    label: '当前状态',
  },
  {
    value: 'remarks',
    label: '备注',
  },
];
export const aliPayBillJudgeOptions = [
  {
    value: 'tradeType',
    label: '交易类型',
  },
  {
    value: 'tradeOtherPerson',
    label: '交易对方',
  },
  {
    value: 'oppositeAccount',
    label: '对方账号',
  },
  {
    value: 'productDescription',
    label: '商品说明',
  },
  {
    value: 'incomeOrPay',
    label: '收/支',
  },
  {
    value: 'paymentMethod',
    label: '支付方式',
  },
  {
    value: 'tradeStatus',
    label: '交易状态',
  },
];
export const bankBillJudgeOptions = [
  {
    value: 'explain',
    label: '摘要',
  },
  {
    value: 'incomeOrPay',
    label: '收/支',
  },
  {
    value: 'tradeOtherPerson',
    label: '对方户名',
  },
  {
    value: 'tradeOtherPersonAccount',
    label: '对方账号',
  },
  {
    value: 'tradeType',
    label: '渠道',
  },
  {
    value: 'tradeOtherPersonRemarks',
    label: '交易对方备注',
  },
];

export const billJudgeKeyArr = [
  'tradeType',
  'currentStatus',
  'paymentMethod',
  'tradeOtherPerson',
  'goods',
  'productDescription',
  'tradeStatus',
  'explain',
  'tradeOtherPersonAccount',
  'incomeOrPay',
];
export const billJudgeKeyOption = billJudgeKeyArr.map((m) => ({
  value: m,
  label: m,
}));

export const judgeWayArr = ['indexOf', 'includes'];
export const judgeWayOption = judgeWayArr.map((m) => ({ value: m, label: m }));

export const measureTypeOption = [
  {
    value: 'hospital',
    label: '医院检测'
  },
  {
    value: 'TGU210-C',
    label: '可孚测量仪TGU210-C'
  },
  {
    value: 'EA-19',
    label: '三诺测量仪EA-19'
  },
];
export const measureTypeMap = arrEnumToObj(measureTypeOption);

// 血糖检测时段
export const bloodSugarPeriodOption = [
  {
    value: '凌晨',
    label: '凌晨',
  },
  {
    value: '空腹',
    label: '空腹',
  },
  {
    value: '早餐后',
    label: '早餐后',
  },
  {
    value: '午餐前',
    label: '午餐前',
  },
  {
    value: '午餐后',
    label: '午餐后',
  },
  {
    value: '晚餐前',
    label: '晚餐前',
  },
  {
    value: '晚餐后',
    label: '晚餐后',
  },
  {
    value: '睡前',
    label: '睡前',
  },
  {
    value: '随机',
    label: '随机',
  },
];
export const bloodSugarPeriodMap = arrEnumToObj(bloodSugarPeriodOption);
