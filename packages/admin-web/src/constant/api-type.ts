/*
 * @Author: YangRuiRui
 * @LastEditTime: 2023-11-17 00:06:39
 * @Description: 接口类型
 */

import { arrEnumToObj } from '@/utils';

// 目录
export const MAIN_DIRECTORY_VALUE: number = 1;

// 菜单
export const MENU_VALUE: number = 5;

// 内嵌
export const EMBEDDED_VALUE: number = 6;

// 外链
export const OUTSIDE_THE_CHAIN_VALUE: number = 7;

// 菜单类型枚举值
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

/**
 * 菜单类型 tag 标签类型
 *  */
export const menuTagTypeNameObj = arrEnumToObj(menuTypeOption, 'value', 'tagTypeName');

// 角色权限类型枚举值
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

// 账单“流入/流出”枚举值
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

// 账单“凭证类型”枚举值
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

// 分类类型
export const categoryTypeEnum: { [x: string]: string } = {
  moneyBillType: 'money_bill_type', // 金额账单类型
  moneyBankType: 'money_bank_type', // 金额银行类型
  moneyBillMethod: 'money_bill_method', // 金额账单方式
  capitalImageSource: 'capital_image_source', // 图片来源
  capitalWaitForDoClassify: 'capital_wait-for-do_classify', // 待办分类
  blogArticleCategory: 'blog_article_category', // 文章类型
};

// 分类类型枚举值
export const categoryTypeOption = Object.keys(categoryTypeEnum).map((key) => ({
  value: categoryTypeEnum[key],
  label: categoryTypeEnum[key],
}));

// 微信账单导入类型
export const weChatBillUploadType = 1;
// 支付宝账单导入类型
export const aliPayBillUploadType = 2;
// 银行账单导入类型
export const bankBillUploadType = 3;
// 账单导入类型
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

// 需处理账单类型
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

// 微信账单导入字段
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
// 支付宝账单导入字段
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
// 银行账单导入字段
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

// 账单导入字段
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
export const billJudgeKeyOption = billJudgeKeyArr.map((m) => ({ value: m, label: m }));

// 账单导入方式
export const judgeWayArr = ['indexOf', 'includes'];
export const judgeWayOption = judgeWayArr.map((m) => ({ value: m, label: m }));
