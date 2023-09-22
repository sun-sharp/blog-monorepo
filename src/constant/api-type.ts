/*
 * @Author: YangRuiRui
 * @LastEditTime: 2023-09-22 11:58:37
 * @Description: 接口类型
 */

import { arrEnumToObj } from '@/utils';

// 一级目录
export const MAIN_DIRECTORY_VALUE = 1;

// 菜单
export const MENU_VALUE = 5;

// 内嵌
export const EMBEDDED_VALUE = 6;

// 外链
export const OUTSIDE_THE_CHAIN_VALUE = 7;

// 菜单类型枚举值
export const menuTypeOption = [
  {
    value: MAIN_DIRECTORY_VALUE,
    label: '一级目录',
  },
  {
    value: 2,
    label: '次级目录',
  },
  {
    value: MENU_VALUE,
    label: '菜单',
  },
  {
    value: EMBEDDED_VALUE,
    label: '内嵌',
  },
  {
    value: OUTSIDE_THE_CHAIN_VALUE,
    label: '外链',
  },
];
export const menuTypeObj = arrEnumToObj(menuTypeOption);

// // 角色权限类型枚举值
// export const roleTypeOption = [
//   {
//     value: 1,
//     label: '全部权限',
//   },
//   {
//     value: 2,
//     label: '自定义权限',
//   },
// ];
// export const roleTypeObj = arrEnumToObj(roleTypeOption);

// // 账单“收入/支出”枚举值
// export const incomeOrPayMap = {
//   收入: 1,
//   支出: 2,
// };

// // 账单“流入/流出”枚举值
// export const inflowOrOutflowOption = [
//   {
//     value: 1,
//     label: '流入',
//   },
//   {
//     value: 2,
//     label: '流出',
//   },
// ];
// export const inflowOrOutflowMap = arrEnumToObj(inflowOrOutflowOption);

// // 账单“凭证类型”枚举值
// export const voucherTypeOption = [
//   {
//     value: 1,
//     label: '存折',
//   },
//   {
//     value: 2,
//     label: '储蓄卡',
//   },
//   {
//     value: 3,
//     label: '信用卡',
//   },
// ];
// export const voucherTypeMap = arrEnumToObj(voucherTypeOption);
