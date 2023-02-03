/*
 * @Author: YangRuiRui
 * @LastEditTime: 2023-02-03 14:51:55
 * @Description: 接口类型
 */

// 将枚举值的数组形式转化成对象形式
const arrEnumToObj = (arr: Array<any>, value = 'value', label = 'label') => {
  const obj = {};
  arr.forEach((item) => {
    obj[item[value]] = item[label];
  });
  return obj;
};

// 菜单类型枚举值
export const menuTypeOption = [
  {
    value: 1,
    label: '一级目录',
  },
  {
    value: 2,
    label: '次级目录',
  },
  {
    value: 5,
    label: '菜单',
  },
  {
    value: 6,
    label: '内嵌',
  },
  {
    value: 7,
    label: '外链',
  },
];
export const menuTypeObj = arrEnumToObj(menuTypeOption);

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

// 图片来源枚举值
export const sourceOption = [
  {
    value: 'user_avatar',
    label: '用户头像',
  },
];
export const sourceObj = arrEnumToObj(sourceOption);

// 账单“收入/支出”枚举值
export const incomeOrPayMap = {
  收入: 1,
  支出: 2,
};

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

// 账单“账单类型”枚举值
export const billTypeOption = [
  {
    value: 1,
    label: '聚餐-AA',
  },
  {
    value: 2,
    label: '红包',
  },
  {
    value: 3,
    label: '父母',
  },
  {
    value: 4,
    label: '妹妹',
  },
  {
    value: 5,
    label: '理财',
  },
  {
    value: 6,
    label: '贷款',
  },
  {
    value: 7,
    label: '保险',
  },
  {
    value: 8,
    label: '利息',
  },
  {
    value: 9,
    label: '腾讯云',
  },
  {
    value: 10,
    label: '阿里云',
  },
  {
    value: 11,
    label: '请客',
  },
  {
    value: 12,
    label: '饭卡',
  },
  {
    value: 102,
    label: '消费-衣',
  },
  {
    value: 103,
    label: '消费-超市',
  },
  {
    value: 104,
    label: '消费-住宿',
  },
  {
    value: 105,
    label: '消费-水果',
  },
  {
    value: 106,
    label: '消费-电器',
  },
  {
    value: 107,
    label: '消费-打印',
  },
  {
    value: 108,
    label: '消费-理发',
  },
  {
    value: 111,
    label: '借出',
  },
  {
    value: 131,
    label: '交通-火车',
  },
  {
    value: 132,
    label: '交通-单车',
  },
  {
    value: 133,
    label: '交通-大巴',
  },
  {
    value: 134,
    label: '交通-打车',
  },
  {
    value: 135,
    label: '交通-油费',
  },
  {
    value: 136,
    label: '交通-地铁',
  },
  {
    value: 137,
    label: '交通-飞机',
  },
  {
    value: 141,
    label: '吃-自做',
  },
  {
    value: 142,
    label: '吃-熟食',
  },
  {
    value: 151,
    label: 'vip会员',
  },
  {
    value: 201,
    label: '提现',
  },
  {
    value: 202,
    label: '话费',
  },
  {
    value: 211,
    label: '医院-挂号',
  },
  {
    value: 212,
    label: '医院-买药',
  },
  {
    value: 241,
    label: '学习-网课',
  },
  {
    value: 501,
    label: '退还',
  },
  {
    value: 502,
    label: '基本工资',
  },
  {
    value: 503,
    label: '奖金',
  },
  {
    value: 504,
    label: '充值',
  },
  {
    value: 1001,
    label: '无效账单',
  },
];
export const billTypeMap = arrEnumToObj(billTypeOption);

// 账单“账单方式”枚举值
export const billMethodOption = [
  {
    value: 1,
    label: '中国工商银行',
  },
  {
    value: 2,
    label: '中国农业银行',
  },
  {
    value: 3,
    label: '中国建设银行',
  },
  {
    value: 4,
    label: '民生银行',
  },
  {
    value: 5,
    label: '招商银行',
  },
  {
    value: 101,
    label: '微信零钱',
  },
  {
    value: 111,
    label: '支付宝余额',
  },
  {
    value: 112,
    label: '支付宝余额包',
  },
  {
    value: 113,
    label: '花呗',
  },
  {
    value: 1001,
    label: '其它',
  },
];
export const billMethodMap = arrEnumToObj(billMethodOption);

// 账单“银行类型”枚举值
export const bankTypeOption = [
  {
    value: 1,
    label: '中国工商银行',
  },
  {
    value: 2,
    label: '中国农业银行',
  },
  {
    value: 3,
    label: '中国建设银行',
  },
  {
    value: 4,
    label: '民生银行',
  },
  {
    value: 5,
    label: '招商银行',
  },
];
export const bankTypeMap = arrEnumToObj(bankTypeOption);

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

// 账单“银行账单类型”枚举值
export const bankBillTypeOption = [
  {
    value: 1,
    label: '支付宝',
  },
  {
    value: 2,
    label: '微信',
  },
  {
    value: 3,
    label: '现金',
  },
  {
    value: 4,
    label: '工资',
  },
  {
    value: 101,
    label: '其它',
  },
];
export const bankBillTypeMap = arrEnumToObj(bankBillTypeOption);
